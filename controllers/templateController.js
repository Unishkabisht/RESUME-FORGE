/**
 * @file templateController.js
 * @description Read-only controller for template designs.
 */

const { Template } = require("../models");

/**
 * Fetch all available templates.
 * @route GET /api/templates
 */
async function getAll(req, res) {
  try {
    const templates = await Template.findAll();
    return res.status(200).json({
      success: true,
      message: "Templates fetched",
      data: templates,
    });
  } catch (error) {
    console.error("getAll templates error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * Fetch a single template by ID or slug/name.
 * @route GET /api/templates/:id
 */
async function getById(req, res) {
  try {
    let template = await Template.findByPk(req.params.id);

    if (!template) {
      template = await Template.findOne({ where: { name: req.params.id } });
    }

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Template fetched",
      data: template,
    });
  } catch (error) {
    console.error("getById template error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  getAll,
  getById,
};
