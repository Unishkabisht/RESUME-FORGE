// controllers/documentController.js
// Handles resume/cover-letter documents using Sequelize MySQL models.

const { Document, Section, Item } = require("../models");

const VALID_TYPES = ["resume", "cover_letter"];

async function checkOwnership(document, userId, res) {
  if (!document) {
    res.status(404).json({ success: false, message: "Document not found" });
    return false;
  }
  if (document.userId !== userId) {
    res.status(403).json({ success: false, message: "Forbidden" });
    return false;
  }
  return true;
}

async function assembleDocument(documentId) {
  const document = await Document.findOne({
    where: { id: documentId },
    include: [
      {
        model: Section,
        include: [
          {
            model: Item,
          },
        ],
      },
    ],
    order: [
      [Section, "position", "ASC"],
      [Section, Item, "position", "ASC"],
    ],
  });

  if (!document) return null;

  // Map to format returned by the old API
  const docJson = document.toJSON();
  if (docJson.Sections) {
    docJson.sections = docJson.Sections.map((sec) => {
      const secData = { ...sec };
      if (sec.Items) {
        secData.items = sec.Items;
        delete secData.Items;
      }
      return secData;
    });
    delete docJson.Sections;
  }

  return docJson;
}

async function listDocuments(req, res) {
  try {
    const documents = await Document.findAll({ where: { userId: req.userId } });
    return res.status(200).json({
      success: true,
      message: "Documents fetched successfully",
      data: documents,
    });
  } catch (error) {
    console.log("error in listDocuments", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function createDocument(req, res) {
  try {
    const { title, type, templateId } = req.body;

    if (!title || !type) {
      return res.status(400).json({
        success: false,
        message: "Title and type are required",
      });
    }

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid type",
      });
    }

    const document = await Document.create({
      userId: req.userId,
      title,
      type,
      templateId: templateId ?? null,
    });

    return res.status(201).json({
      success: true,
      message: "Document created successfully",
      data: document,
    });
  } catch (error) {
    console.log("error in createDocument", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function importDocument(req, res) {
  try {
    const { source, title, rawData } = req.body;

    if (!source || !title) {
      return res.status(400).json({
        success: false,
        message: "Source and title are required",
      });
    }

    const document = await Document.create({
      userId: req.userId,
      title,
      type: "resume",
    });

    const section = await Section.create({
      documentId: document.id,
      heading: "Imported Content",
      position: 1,
    });

    await Item.create({
      sectionId: section.id,
      content: typeof rawData === "string" ? rawData : JSON.stringify(rawData),
      position: 1,
    });

    const assembled = await assembleDocument(document.id);

    return res.status(201).json({
      success: true,
      message: `Document imported from ${source}; content auto-generated from rawData`,
      data: assembled,
    });
  } catch (error) {
    console.log("error in importDocument", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function getDocument(req, res) {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!(await checkOwnership(document, req.userId, res))) return;

    const assembled = await assembleDocument(document.id);

    return res.status(200).json({
      success: true,
      message: "Document fetched successfully",
      data: assembled,
    });
  } catch (error) {
    console.log("error in getDocument", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function updateDocument(req, res) {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!(await checkOwnership(document, req.userId, res))) return;

    const { title, templateId } = req.body;
    if (title !== undefined) document.title = title;
    if (templateId !== undefined) document.templateId = templateId;
    await document.save();

    return res.status(200).json({
      success: true,
      message: "Document updated successfully",
      data: document,
    });
  } catch (error) {
    console.log("error in updateDocument", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function duplicateDocument(req, res) {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!(await checkOwnership(document, req.userId, res))) return;

    const copy = await Document.create({
      userId: req.userId,
      title: `${document.title} (copy)`,
      type: document.type,
      templateId: document.templateId,
    });

    const sections = await Section.findAll({
      where: { documentId: document.id },
      include: [Item],
      order: [["position", "ASC"]],
    });

    for (const section of sections) {
      const newSection = await Section.create({
        documentId: copy.id,
        heading: section.heading,
        position: section.position,
      });

      for (const item of (section.Items || [])) {
        await Item.create({
          sectionId: newSection.id,
          content: item.content,
          position: item.position,
        });
      }
    }

    const assembled = await assembleDocument(copy.id);

    return res.status(201).json({
      success: true,
      message: "Document duplicated successfully",
      data: assembled,
    });
  } catch (error) {
    console.log("error in duplicateDocument", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function deleteDocument(req, res) {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!(await checkOwnership(document, req.userId, res))) return;

    await document.destroy();

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
      data: {},
    });
  } catch (error) {
    console.log("error in deleteDocument", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = {
  listDocuments,
  createDocument,
  importDocument,
  getDocument,
  updateDocument,
  duplicateDocument,
  deleteDocument,
  checkOwnership,
  assembleDocument,
};
