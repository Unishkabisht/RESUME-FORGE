/**
 * @file applicationController.js
 * @description Simplified controller for job application tracking.
 */

const { Application, Document } = require("../models");

const VALID_STATUSES = ["saved", "applied", "interview", "offer", "rejected"];

/**
 * Fetch all job applications for logged-in user.
 */
async function getAll(req, res) {
  try {
    const list = await Application.findAll({
      where: { userId: req.userId },
      include: [{ model: Document, attributes: ["id", "title"] }],
      order: [["updatedAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: list,
    });
  } catch (error) {
    console.error("getAll applications error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * Fetch single job application by ID.
 */
async function getById(req, res) {
  try {
    const app = await Application.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!app) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: app,
    });
  } catch (error) {
    console.error("getById application error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * Create a new job application entry.
 */
async function create(req, res) {
  try {
    const { company, role, status, documentId } = req.body || {};

    if (!company || !role) {
      return res.status(400).json({
        success: false,
        message: "Company and role are required",
      });
    }

    let statusValue = "saved";
    if (status !== undefined) {
      if (status === null || status === "") {
        statusValue = null;
      } else {
        statusValue = String(status).toLowerCase();
        if (!VALID_STATUSES.includes(statusValue)) {
          return res.status(400).json({
            success: false,
            message: "Invalid status value",
          });
        }
      }
    }

    if (documentId) {
      const doc = await Document.findOne({
        where: { id: documentId, userId: req.userId },
      });
      if (!doc) {
        return res.status(400).json({
          success: false,
          message: "Invalid or unauthorized document ID",
        });
      }
    }

    const app = await Application.create({
      userId: req.userId,
      company,
      role,
      status: statusValue,
      documentId: documentId || null,
    });

    return res.status(201).json({
      success: true,
      data: app,
    });
  } catch (error) {
    console.error("create application error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * Update job application details.
 */
async function update(req, res) {
  try {
    const app = await Application.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!app) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const { company, role, status, documentId } = req.body || {};

    let statusValue = undefined;
    if (status !== undefined) {
      if (status === null || status === "") {
        statusValue = null;
      } else {
        statusValue = String(status).toLowerCase();
        if (!VALID_STATUSES.includes(statusValue)) {
          return res.status(400).json({
            success: false,
            message: "Invalid status value",
          });
        }
      }
    }

    if (documentId !== undefined) {
      if (documentId !== null) {
        const doc = await Document.findOne({
          where: { id: documentId, userId: req.userId },
        });
        if (!doc) {
          return res.status(400).json({
            success: false,
            message: "Invalid or unauthorized document ID",
          });
        }
      }
      app.documentId = documentId;
    }

    if (company !== undefined) app.company = company;
    if (role !== undefined) app.role = role;
    if (statusValue !== undefined) app.status = statusValue;

    await app.save();

    return res.status(200).json({
      success: true,
      data: app,
    });
  } catch (error) {
    console.error("update application error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * Delete a job application entry.
 */
async function remove(req, res) {
  try {
    const app = await Application.findOne({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!app) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    await app.destroy();

    return res.status(200).json({
      success: true,
      message: "Application deleted",
    });
  } catch (error) {
    console.error("remove application error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
