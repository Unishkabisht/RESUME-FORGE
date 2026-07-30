/**
 * @file versionRoutes.js
 * @description Express router for version snapshot management.
 */

const express = require("express");
const router = express.Router();

const authValidator = require("../middlewares/authValidator");
const versionController = require("../controllers/versionController");

router.get("/document/:id", authValidator, versionController.getAll);
router.post("/document/:id", authValidator, versionController.create);
router.get("/document/:id/:versionId", authValidator, versionController.getById);
router.delete("/document/:id/:versionId", authValidator, versionController.remove);

module.exports = router;
