// controllers/versionController.js
// Handles document versions

const { Document, Version } = require("../models");
const { checkOwner } = require("./documentController");

async function getAll(req, res) {
  try {
    const documentId = req.params.id;

    const document = await Document.findByPk(documentId);
    if (!(await checkOwner(document, req.userId, res))) return;

    const versions = await Version.findAll({
      where: { documentId },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Versions fetched successfully",
      data: versions,
    });
  } catch (error) {
    console.log("error in getAll versions", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function create(req, res) {
  try {
    const documentId = req.params.id;
    const { label, snapshot } = req.body;

    const document = await Document.findByPk(documentId);
    if (!(await checkOwner(document, req.userId, res))) return;

    const version = await Version.create({
      documentId: document.id,
      label: label || "Version Snapshot",
      snapshot: typeof snapshot === "string" ? snapshot : JSON.stringify(snapshot || {}),
    });

    return res.status(201).json({
      success: true,
      message: "Version created successfully",
      data: version,
    });
  } catch (error) {
    console.log("error in create version", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function getById(req, res) {
  try {
    const documentId = req.params.id;
    const { versionId } = req.params;

    const document = await Document.findByPk(documentId);
    if (!(await checkOwner(document, req.userId, res))) return;

    const version = await Version.findOne({
      where: { id: versionId, documentId: document.id },
    });

    if (!version) {
      return res.status(404).json({ success: false, message: "Version not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Version fetched successfully",
      data: version,
    });
  } catch (error) {
    console.log("error in getById version", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function remove(req, res) {
  try {
    const documentId = req.params.id;
    const { versionId } = req.params;

    const document = await Document.findByPk(documentId);
    if (!(await checkOwner(document, req.userId, res))) return;

    const version = await Version.findOne({
      where: { id: versionId, documentId: document.id },
    });

    if (!version) {
      return res.status(404).json({ success: false, message: "Version not found" });
    }

    await version.destroy();

    return res.status(200).json({
      success: true,
      message: "Version deleted successfully",
      data: {},
    });
  } catch (error) {
    console.log("error in remove version", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = {
  getAll,
  create,
  getById,
  remove,
};
