const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

const authValidator = require("../middlewares/authValidator");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/reset-password", authValidator, authController.resetPassword);

module.exports = router;
