/**
 * @file shareRoutes.js
 * @description Express router for public document sharing.
 */

const express = require("express");
const router = express.Router();
const shareController = require("../controllers/shareController");

router.get("/:slug", shareController.getPublic);

module.exports = router;
