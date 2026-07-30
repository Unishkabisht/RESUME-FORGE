/**
 * @file index.js
 * @description Primary Express router assembling all individual API sub-routers.
 */

const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const documentRoutes = require("./documentRoutes");
const sectionRoutes = require("./sectionRoutes");
const versionRoutes = require("./versionRoutes");
const templateRoutes = require("./templateRoutes");
const shareRoutes = require("./shareRoutes");
const applicationRoutes = require("./applicationRoutes");
const exportRoutes = require("./exportRoutes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/documents", documentRoutes);
router.use("/sections", sectionRoutes);
router.use("/versions", versionRoutes);
router.use("/templates", templateRoutes);
router.use("/share", shareRoutes);
router.use("/applications", applicationRoutes);
router.use("/exports", exportRoutes);

module.exports = router;