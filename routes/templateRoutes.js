const express = require("express");
const router = express.Router();
const templateController = require("../controllers/templateController");

router.get("/", templateController.getAll);
router.get("/:id", templateController.getById);

module.exports = router;
