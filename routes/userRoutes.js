const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authValidator = require("../middlewares/authValidator");

router.get("/me", authValidator, userController.getMe);
router.put("/me", authValidator, userController.updateMe);
router.delete("/me", authValidator, userController.deleteMe);

module.exports = router;
