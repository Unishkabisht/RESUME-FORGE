// controllers/sectionController.js
// Handles sections within a document and the items inside each section.

const { Document, Section, Item } = require("../models");
const { checkOwner } = require("./documentController");

const VALID_SECTION_TYPES = ["experience", "education", "skills", "projects", "custom"];

async function getDoc(req, res) {
  const document = await Document.findByPk(req.params.id);
  if (!(await checkOwner(document, req.userId, res))) return null;
  return document;
}

async function getSection(documentId, sectionId, res) {
  const section = await Section.findByPk(sectionId);
  if (!section || section.documentId !== Number(documentId)) {
    res.status(404).json({ success: false, message: "Section not found" });
    return null;
  }
  return section;
}

async function create(req, res) {
  try {
    const document = await getDoc(req, res);
    if (!document) return;

    const { type, label } = req.body;
    if (!type) {
      return res.status(400).json({ success: false, message: "Section type is required" });
    }

    if (!VALID_SECTION_TYPES.includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid section type" });
    }

    const docSectionsCount = await Section.count({ where: { documentId: document.id } });

    const section = await Section.create({
      documentId: document.id,
      type,
      label: label || type,
      heading: label || type,
      order: docSectionsCount + 1,
      position: docSectionsCount + 1,
    });

    return res.status(201).json({
      success: true,
      message: "Section created successfully",
      data: section,
    });
  } catch (error) {
    console.log("error in create section", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function update(req, res) {
  try {
    const document = await getDoc(req, res);
    if (!document) return;

    const section = await getSection(document.id, req.params.sectionId, res);
    if (!section) return;

    const { label, order } = req.body;
    if (label !== undefined) {
      section.label = label;
      section.heading = label;
    }
    if (order !== undefined) {
      section.order = order;
      section.position = order;
    }
    await section.save();

    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: section,
    });
  } catch (error) {
    console.log("error in update section", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function remove(req, res) {
  try {
    const document = await getDoc(req, res);
    if (!document) return;

    const section = await getSection(document.id, req.params.sectionId, res);
    if (!section) return;

    await section.destroy();

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      data: {},
    });
  } catch (error) {
    console.log("error in remove section", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function createItem(req, res) {
  try {
    const document = await getDoc(req, res);
    if (!document) return;

    const section = await getSection(document.id, req.params.sectionId, res);
    if (!section) return;

    const { fields } = req.body;
    const itemsCount = await Item.count({ where: { sectionId: section.id } });

    const item = await Item.create({
      sectionId: section.id,
      fields: fields || {},
      content: fields ? JSON.stringify(fields) : "",
      order: itemsCount + 1,
      position: itemsCount + 1,
    });

    return res.status(201).json({
      success: true,
      message: "Section item created successfully",
      data: item,
    });
  } catch (error) {
    console.log("error in createItem", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function updateItem(req, res) {
  try {
    const document = await getDoc(req, res);
    if (!document) return;

    const section = await getSection(document.id, req.params.sectionId, res);
    if (!section) return;

    const item = await Item.findByPk(req.params.itemId);
    if (!item || item.sectionId !== section.id) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    const { fields, order } = req.body;
    if (fields !== undefined) {
      item.fields = fields;
      item.content = JSON.stringify(fields);
    }
    if (order !== undefined) {
      item.order = order;
      item.position = order;
    }
    await item.save();

    return res.status(200).json({
      success: true,
      message: "Section item updated successfully",
      data: item,
    });
  } catch (error) {
    console.log("error in updateItem", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function removeItem(req, res) {
  try {
    const document = await getDoc(req, res);
    if (!document) return;

    const section = await getSection(document.id, req.params.sectionId, res);
    if (!section) return;

    const item = await Item.findByPk(req.params.itemId);
    if (!item || item.sectionId !== section.id) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    await item.destroy();

    return res.status(200).json({
      success: true,
      message: "Section item deleted successfully",
      data: {},
    });
  } catch (error) {
    console.log("error in removeItem", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = {
  create,
  update,
  remove,
  createItem,
  updateItem,
  removeItem,
};
