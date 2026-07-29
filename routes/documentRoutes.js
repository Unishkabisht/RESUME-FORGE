const express = require("express");
const router = express.Router();

// Middlewares
const authValidator = require("../middlewares/authValidator");
const documentValidator = require("../middlewares/documentValidator");

// Controllers
const documentController = require("../controllers/documentController");
const sectionController = require("../controllers/sectionController");
const versionController = require("../controllers/versionController");

// ================= DOCUMENTS =================
router.get("/", authValidator, documentController.getAll);
router.post("/", authValidator, documentController.create);
router.post("/import", authValidator, documentController.importDoc);
router.get("/:id", authValidator, documentValidator, documentController.getById);
router.put("/:id", authValidator, documentValidator, documentController.update);
router.post("/:id/duplicate", authValidator, documentValidator, documentController.duplicate);
router.delete("/:id", authValidator, documentValidator, documentController.remove);

// ================= VERSIONS =================
router.get("/:id/versions", authValidator, documentValidator, versionController.getAll);
router.post("/:id/versions", authValidator, documentValidator, versionController.create);
router.get("/:id/versions/:versionId", authValidator, documentValidator, versionController.getById);
router.delete("/:id/versions/:versionId", authValidator, documentValidator, versionController.remove);

// ================= SECTIONS (nested under a document) =================
router.post("/:id/sections", authValidator, documentValidator, sectionController.create);
router.patch("/:id/sections/:sectionId", authValidator, documentValidator, sectionController.update);
router.delete("/:id/sections/:sectionId", authValidator, documentValidator, sectionController.remove);

// Items inside a section
router.post("/:id/sections/:sectionId/items", authValidator, documentValidator, sectionController.createItem);
router.patch("/:id/sections/:sectionId/items/:itemId", authValidator, documentValidator, sectionController.updateItem);
router.delete("/:id/sections/:sectionId/items/:itemId", authValidator, documentValidator, sectionController.removeItem);

module.exports = router;
