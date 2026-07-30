/**
 * @file userRoutes.js
 * @description Express router for user profile endpoints.
 */

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authValidator = require("../middlewares/authValidator");

router.get("/me", authValidator, userController.getMe);
router.put("/me", authValidator, userController.update);
router.delete("/me", authValidator, userController.remove);

module.exports = router;
