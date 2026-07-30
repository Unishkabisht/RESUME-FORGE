/**
 * @file versionController.js
 * @description Controller for managing document version snapshots.
 */

const { Document, Version } = require("../models");
const { checkOwner, assembleDoc } = require("./documentController");

/**
 * Fetch all versions for a document.
 * @route GET /api/documents/:id/versions
 */
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
      message: "Versions fetched",
      data: versions,
    });
  } catch (error) {
    console.error("getAll versions error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * Create a new version snapshot for a document.
 * @route POST /api/documents/:id/versions
 */
async function create(req, res) {
  try {
    const documentId = req.params.id;
    const { label, snapshot } = req.body || {};

    const document = await Document.findByPk(documentId);
    if (!(await checkOwner(document, req.userId, res))) return;

    let snapshotData = snapshot;
    if (!snapshotData) {
      // Automatically snapshot the current state of the document
      const assembled = await assembleDoc(document.id);
      snapshotData = JSON.stringify({ assembled });
    } else if (typeof snapshotData !== "string") {
      snapshotData = JSON.stringify(snapshotData);
    }

    const version = await Version.create({
      documentId: document.id,
      label: label || "Version Snapshot",
      snapshot: snapshotData,
    });

    return res.status(201).json({
      success: true,
      message: "Version created",
      data: version,
    });
  } catch (error) {
    console.error("create version error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * Fetch a specific version by ID.
 * @route GET /api/documents/:id/versions/:versionId
 */
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
      return res.status(404).json({
        success: false,
        message: "Version not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Version fetched",
      data: version,
    });
  } catch (error) {
    console.error("getById version error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * Delete a specific version snapshot.
 * @route DELETE /api/documents/:id/versions/:versionId
 */
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
      return res.status(404).json({
        success: false,
        message: "Version not found",
      });
    }

    await version.destroy();

    return res.status(200).json({
      success: true,
      message: "Version deleted",
      data: {},
    });
  } catch (error) {
    console.error("remove version error:", error);
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
  remove,
};
