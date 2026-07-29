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
router.get("/", authValidator, documentController.listDocuments);
router.post("/", authValidator, documentController.createDocument);
router.post("/import", authValidator, documentController.importDocument);
router.get("/:id", authValidator, documentValidator, documentController.getDocument);
router.put("/:id", authValidator, documentValidator, documentController.updateDocument);
router.post("/:id/duplicate", authValidator, documentValidator, documentController.duplicateDocument);
router.delete("/:id", authValidator, documentValidator, documentController.deleteDocument);

// ================= VERSIONS =================
router.get("/:id/versions", authValidator, documentValidator, versionController.listVersions);
router.post("/:id/versions", authValidator, documentValidator, versionController.createVersion);
router.get("/:id/versions/:versionId", authValidator, documentValidator, versionController.getVersion);
router.delete("/:id/versions/:versionId", authValidator, documentValidator, versionController.deleteVersion);

// ================= SECTIONS (nested under a document) =================
router.post("/:id/sections", authValidator, documentValidator, sectionController.createSection);
router.patch("/:id/sections/:sectionId", authValidator, documentValidator, sectionController.updateSection);
router.delete("/:id/sections/:sectionId", authValidator, documentValidator, sectionController.deleteSection);

// Items inside a section
router.post("/:id/sections/:sectionId/items", authValidator, documentValidator, sectionController.createItem);
router.patch("/:id/sections/:sectionId/items/:itemId", authValidator, documentValidator, sectionController.updateItem);
router.delete("/:id/sections/:sectionId/items/:itemId", authValidator, documentValidator, sectionController.deleteItem);

module.exports = router;
