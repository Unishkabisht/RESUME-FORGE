/**
 * @file sectionRoutes.js
 * @description Express router for document sections and section items.
 */

const express = require("express");
const router = express.Router();

const authValidator = require("../middlewares/authValidator");
const sectionController = require("../controllers/sectionController");

router.post("/:id/sections", authValidator, sectionController.create);
router.patch("/:id/sections/:sectionId", authValidator, sectionController.update);
router.delete("/:id/sections/:sectionId", authValidator, sectionController.remove);

// Items inside a section
router.post("/:id/sections/:sectionId/items", authValidator, sectionController.addItem);
router.patch("/:id/sections/:sectionId/items/:itemId", authValidator, sectionController.updateItem);
router.delete("/:id/sections/:sectionId/items/:itemId", authValidator, sectionController.removeItem);

module.exports = router;
