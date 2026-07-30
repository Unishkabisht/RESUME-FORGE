/**
 * @file shareController.js
 * @description Controller for public document sharing and slug generation.
 */

const crypto = require("crypto");
const { Document, Share } = require("../models");
const { checkOwner, assembleDoc } = require("./documentController");

/**
 * Generate a public share link for a document.
 * @route POST /api/documents/:id/share
 */
async function create(req, res) {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!(await checkOwner(document, req.userId, res))) return;

    let share = await Share.findOne({ where: { documentId: document.id } });

    if (!share) {
      const slug = crypto.randomBytes(8).toString("hex");
      share = await Share.create({ documentId: document.id, slug });
    }

    const shareUrl = `${req.protocol}://${req.get("host")}/api/share/${share.slug}`;

    return res.status(200).json({
      success: true,
      message: "Share link created",
      data: { id: share.id, slug: share.slug, documentId: share.documentId, shareUrl },
    });
  } catch (error) {
    console.error("create share error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * Fetch existing share details for a document.
 * @route GET /api/documents/:id/share
 */
async function getByDoc(req, res) {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!(await checkOwner(document, req.userId, res))) return;

    const share = await Share.findOne({ where: { documentId: document.id } });

    if (!share) {
      return res.status(404).json({
        success: false,
        message: "Share link not found",
      });
    }

    const shareUrl = `${req.protocol}://${req.get("host")}/api/share/${share.slug}`;

    return res.status(200).json({
      success: true,
      message: "Share link fetched",
      data: { id: share.id, slug: share.slug, documentId: share.documentId, shareUrl },
    });
  } catch (error) {
    console.error("getByDoc share error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * Revoke public share link for a document.
 * @route DELETE /api/documents/:id/share
 */
async function remove(req, res) {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!(await checkOwner(document, req.userId, res))) return;

    const share = await Share.findOne({ where: { documentId: document.id } });

    if (!share) {
      return res.status(404).json({
        success: false,
        message: "Share link not found",
      });
    }

    await share.destroy();

    return res.status(200).json({
      success: true,
      message: "Share link revoked",
      data: {},
    });
  } catch (error) {
    console.error("remove share error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * Access public shared document by unique slug.
 * @route GET /api/share/:slug
 */
async function getPublic(req, res) {
  try {
    const { slug } = req.params;

    const share = await Share.findOne({ where: { slug } });
    if (!share) {
      return res.status(404).json({
        success: false,
        message: "Link not found or expired",
      });
    }

    const assembled = await assembleDoc(share.documentId);
    if (!assembled) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Document fetched",
      data: assembled,
    });
  } catch (error) {
    console.error("getPublic share error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  create,
  getByDoc,
  remove,
  getPublic,
};
