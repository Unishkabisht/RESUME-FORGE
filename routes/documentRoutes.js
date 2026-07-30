/**
 * @file documentRoutes.js
 * @description Express router for document central resource and nested sub-actions.
 */

const express = require("express");
const router = express.Router();

const authValidator = require("../middlewares/authValidator");
const documentValidator = require("../middlewares/documentValidator");

const documentController = require("../controllers/documentController");
const sectionController = require("../controllers/sectionController");
const versionController = require("../controllers/versionController");
const shareController = require("../controllers/shareController");
const exportController = require("../controllers/exportController");

// ================= DOCUMENTS =================
router.get("/", authValidator, documentController.getAll);
router.post("/", authValidator, documentController.create);
router.get("/:id", authValidator, documentValidator, documentController.getById);
router.put("/:id", authValidator, documentValidator, documentController.update);
router.post("/:id/duplicate", authValidator, documentValidator, documentController.duplicate);
router.delete("/:id", authValidator, documentValidator, documentController.remove);

// ================= VERSIONS =================
router.get("/:id/versions", authValidator, documentValidator, versionController.getAll);
router.post("/:id/versions", authValidator, documentValidator, versionController.create);
router.get("/:id/versions/:versionId", authValidator, documentValidator, versionController.getById);
router.delete("/:id/versions/:versionId", authValidator, documentValidator, versionController.remove);

// ================= SECTIONS & ITEMS =================
router.post("/:id/sections", authValidator, documentValidator, sectionController.create);
router.patch("/:id/sections/:sectionId", authValidator, documentValidator, sectionController.update);
router.delete("/:id/sections/:sectionId", authValidator, documentValidator, sectionController.remove);

// ================= ITEMS =================
router.post("/:id/sections/:sectionId/items", authValidator, documentValidator, sectionController.addItem);
router.patch("/:id/sections/:sectionId/items/:itemId", authValidator, documentValidator, sectionController.updateItem);
router.delete("/:id/sections/:sectionId/items/:itemId", authValidator, documentValidator, sectionController.removeItem);

// ================= SHARES =================
router.post("/:id/share", authValidator, documentValidator, shareController.create);
router.get("/:id/share", authValidator, documentValidator, shareController.getByDoc);
router.delete("/:id/share", authValidator, documentValidator, shareController.remove);

// ================= EXPORTS =================
router.post("/:id/export", authValidator, documentValidator, exportController.create);
router.get("/:id/exports", authValidator, documentValidator, exportController.getByDoc);

module.exports = router;
