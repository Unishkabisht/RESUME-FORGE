// routes/index.js
// Single entry point for all API routes.
// Registers all split routes so that app.js only has to mount this one router.

const express = require("express");
const router = express.Router();

// Import individual routers
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const documentRoutes = require("./documentRoutes");
const templateRoutes = require("./templateRoutes");

// Mount the routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/documents", documentRoutes);
router.use("/templates", templateRoutes);

module.exports = router;