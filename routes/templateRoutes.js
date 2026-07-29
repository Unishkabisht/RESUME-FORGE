const express = require("express");
const router = express.Router();
const templateController = require("../controllers/templateController");

router.get("/", templateController.listTemplates);
router.get("/:id", templateController.getTemplate);

module.exports = router;
