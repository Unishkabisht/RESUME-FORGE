// controllers/templateController.js
// Read-only endpoints for browsing resume templates.

const { Template } = require("../models");

async function listTemplates(req, res) {
  try {
    const templates = await Template.findAll();
    return res.status(200).json({
      success: true,
      message: "Templates fetched successfully",
      data: templates,
    });
  } catch (error) {
    console.log("error in listTemplates", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function getTemplate(req, res) {
  try {
    let template = await Template.findByPk(req.params.id);
    
    if (!template) {
      // Fallback: try finding by name in case the client sent a slug instead of an ID
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
      message: "Template fetched successfully",
      data: template,
    });
  } catch (error) {
    console.log("error in getTemplate", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = { listTemplates, getTemplate };
