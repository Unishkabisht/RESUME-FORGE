/**
 * @file exportController.js
 * @description Controller for document exports.
 */

const { Document, Export } = require("../models");
const { checkOwner } = require("./documentController");

async function create(req, res) {
  try {
    const documentId = req.params.id;
    const { format, customFileUrl } = req.body;

    if (!format || !["pdf", "docx"].includes(format)) {
      return res.status(400).json({
        success: false,
        message: "Format required ('pdf' or 'docx')",
      });
    }

    const document = await Document.findByPk(documentId);
    if (!(await checkOwner(document, req.userId, res))) return;

    const fileUrl = customFileUrl || `/exports/resume-${document.id}.${format}`;

    const record = await Export.create({
      documentId: document.id,
      userId: req.userId,
      format,
      fileUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Export created",
      data: record,
    });
  } catch (error) {
    console.error("create export error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function getByDoc(req, res) {
  try {
    const documentId = req.params.id;
    const document = await Document.findByPk(documentId);
    if (!(await checkOwner(document, req.userId, res))) return;

    const exports = await Export.findAll({
      where: { documentId: document.id, userId: req.userId },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Exports fetched",
      data: exports,
    });
  } catch (error) {
    console.error("getByDoc exports error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function getAll(req, res) {
  try {
    const exports = await Export.findAll({
      where: { userId: req.userId },
      include: [{ model: Document, attributes: ["id", "title", "type"] }],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Exports fetched",
      data: exports,
    });
  } catch (error) {
    console.error("getAll exports error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function getById(req, res) {
  try {
    const record = await Export.findOne({
      where: { id: req.params.id, userId: req.userId },
      include: [{ model: Document, attributes: ["id", "title", "type"] }],
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Export not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Export fetched",
      data: record,
    });
  } catch (error) {
    console.error("getById export error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  create,
  getByDoc,
  getAll,
  getById,
};
