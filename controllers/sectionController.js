/**
 * @file sectionController.js
 * @description Controller for document sections and section items.
 */

const { Document, Section, Item } = require("../models");
const { checkOwner } = require("./documentController");

const VALID_TYPES = ["experience", "education", "skills", "projects", "custom"];

/**
 * Fetch and authorize document owner.
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Promise<Object|null>} Document instance
 */
async function getDoc(req, res) {
  const document = await Document.findByPk(req.params.id);
  if (!(await checkOwner(document, req.userId, res))) return null;
  return document;
}

/**
 * Fetch section belonging to document.
 * @param {number} documentId - Document ID
 * @param {number} sectionId - Section ID
 * @param {Object} res - Response object
 * @returns {Promise<Object|null>} Section instance
 */
async function getSec(documentId, sectionId, res) {
  const section = await Section.findByPk(sectionId);
  if (!section || section.documentId !== Number(documentId)) {
    res.status(404).json({
      success: false,
      message: "Section not found",
    });
    return null;
  }
  return section;
}

/**
 * Create a new section.
 * @route POST /api/documents/:id/sections
 */
async function create(req, res) {
  try {
    const document = await getDoc(req, res);
    if (!document) return;

    const { type, label } = req.body;
    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Section type required",
      });
    }

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid section type",
      });
    }

    const count = await Section.count({ where: { documentId: document.id } });

    const section = await Section.create({
      documentId: document.id,
      heading: label || type,
      position: count + 1,
    });

    return res.status(201).json({
      success: true,
      message: "Section created",
      data: section,
    });
  } catch (error) {
    console.error("create section error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * Update an existing section.
 * @route PATCH /api/documents/:id/sections/:sectionId
 */
async function update(req, res) {
  try {
    const document = await getDoc(req, res);
    if (!document) return;

    const section = await getSec(document.id, req.params.sectionId, res);
    if (!section) return;

    const { label, order } = req.body;
    if (label !== undefined) section.heading = label;
    if (order !== undefined) section.position = order;
    await section.save();

    return res.status(200).json({
      success: true,
      message: "Section updated",
      data: section,
    });
  } catch (error) {
    console.error("update section error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * Delete a section.
 * @route DELETE /api/documents/:id/sections/:sectionId
 */
async function remove(req, res) {
  try {
    const document = await getDoc(req, res);
    if (!document) return;

    const section = await getSec(document.id, req.params.sectionId, res);
    if (!section) return;

    await section.destroy();

    return res.status(200).json({
      success: true,
      message: "Section deleted",
      data: {},
    });
  } catch (error) {
    console.error("remove section error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * Add an item to a section.
 * @route POST /api/documents/:id/sections/:sectionId/items
 */
async function addItem(req, res) {
  try {
    const document = await getDoc(req, res);
    if (!document) return;

    const section = await getSec(document.id, req.params.sectionId, res);
    if (!section) return;

    const { fields, content } = req.body;
    const count = await Item.count({ where: { sectionId: section.id } });

    const item = await Item.create({
      sectionId: section.id,
      content: content || (fields ? JSON.stringify(fields) : ""),
      position: count + 1,
    });

    return res.status(201).json({
      success: true,
      message: "Item created",
      data: item,
    });
  } catch (error) {
    console.error("addItem error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * Update an item inside a section.
 * @route PATCH /api/documents/:id/sections/:sectionId/items/:itemId
 */
async function updateItem(req, res) {
  try {
    const document = await getDoc(req, res);
    if (!document) return;

    const section = await getSec(document.id, req.params.sectionId, res);
    if (!section) return;

    const item = await Item.findByPk(req.params.itemId);
    if (!item || item.sectionId !== section.id) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    const { fields, content, order } = req.body;
    if (content !== undefined) item.content = content;
    else if (fields !== undefined) item.content = JSON.stringify(fields);
    if (order !== undefined) item.position = order;
    await item.save();

    return res.status(200).json({
      success: true,
      message: "Item updated",
      data: item,
    });
  } catch (error) {
    console.error("updateItem error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * Remove an item from a section.
 * @route DELETE /api/documents/:id/sections/:sectionId/items/:itemId
 */
async function removeItem(req, res) {
  try {
    const document = await getDoc(req, res);
    if (!document) return;

    const section = await getSec(document.id, req.params.sectionId, res);
    if (!section) return;

    const item = await Item.findByPk(req.params.itemId);
    if (!item || item.sectionId !== section.id) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    await item.destroy();

    return res.status(200).json({
      success: true,
      message: "Item deleted",
      data: {},
    });
  } catch (error) {
    console.error("removeItem error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  create,
  update,
  remove,
  addItem,
  updateItem,
  removeItem,
};
