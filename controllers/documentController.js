/**
 * @file documentController.js
 * @description Controller for document management (resumes and cover letters).
 */

const { Document, Section, Item } = require("../models");

async function checkOwner(document, userId, res) {
  if (!document) {
    res.status(404).json({
      success: false,
      message: "Document not found",
    });
    return false;
  }
  if (document.userId !== userId) {
    res.status(403).json({
      success: false,
      message: "Forbidden",
    });
    return false;
  }
  return true;
}

async function assembleDoc(documentId) {
  const document = await Document.findOne({
    where: { id: documentId },
    include: [
      {
        model: Section,
        include: [{ model: Item }],
      },
    ],
    order: [
      [Section, "position", "ASC"],
      [Section, Item, "position", "ASC"],
    ],
  });

  if (!document) return null;

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

async function getAll(req, res) {
  try {
    const documents = await Document.findAll({ where: { userId: req.userId } });
    return res.status(200).json({
      success: true,
      message: "Documents fetched",
      data: documents,
    });
  } catch (error) {
    console.error("getAll documents error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function create(req, res) {
  try {
    const { title, type, templateId } = req.body;

    if (!title || !type) {
      return res.status(400).json({
        success: false,
        message: "Title and type required",
      });
    }

    const document = await Document.create({
      userId: req.userId,
      title,
      type,
      templateId: templateId || null,
    });

    return res.status(201).json({
      success: true,
      message: "Document created",
      data: document,
    });
  } catch (error) {
    console.error("create document error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function getById(req, res) {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!(await checkOwner(document, req.userId, res))) return;

    const assembledDoc = await assembleDoc(document.id);

    return res.status(200).json({
      success: true,
      message: "Document fetched",
      data: assembledDoc,
    });
  } catch (error) {
    console.error("getById document error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function update(req, res) {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!(await checkOwner(document, req.userId, res))) return;

    const { title, templateId } = req.body;
    if (title !== undefined) document.title = title;
    if (templateId !== undefined) document.templateId = templateId;
    await document.save();

    return res.status(200).json({
      success: true,
      message: "Document updated",
      data: document,
    });
  } catch (error) {
    console.error("update document error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function duplicate(req, res) {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!(await checkOwner(document, req.userId, res))) return;

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

      for (const item of section.Items || []) {
        await Item.create({
          sectionId: newSection.id,
          content: item.content,
          position: item.position,
        });
      }
    }

    const assembledDoc = await assembleDoc(copy.id);

    return res.status(201).json({
      success: true,
      message: "Document duplicated",
      data: assembledDoc,
    });
  } catch (error) {
    console.error("duplicate document error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function remove(req, res) {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!(await checkOwner(document, req.userId, res))) return;

    await document.destroy();

    return res.status(200).json({
      success: true,
      message: "Document deleted",
      data: {},
    });
  } catch (error) {
    console.error("remove document error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  getAll,
  create,
  getById,
  update,
  duplicate,
  remove,
  checkOwner,
  assembleDoc,
};
