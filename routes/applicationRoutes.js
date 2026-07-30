/**
 * @file applicationRoutes.js
 * @description Express router for job application tracking.
 */

const express = require("express");
const router = express.Router();

const authValidator = require("../middlewares/authValidator");
const applicationController = require("../controllers/applicationController");

router.get("/", authValidator, applicationController.getAll);
router.post("/", authValidator, applicationController.create);
router.get("/:id", authValidator, applicationController.getById);
router.put("/:id", authValidator, applicationController.update);
router.delete("/:id", authValidator, applicationController.remove);

module.exports = router;
