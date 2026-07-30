/**
 * @file exportRoutes.js
 * @description Express router for document export records.
 */

const express = require("express");
const router = express.Router();

const authValidator = require("../middlewares/authValidator");
const exportController = require("../controllers/exportController");

router.get("/", authValidator, exportController.getAll);
router.get("/:id", authValidator, exportController.getById);

module.exports = router;
