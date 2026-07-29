// controllers/userController.js
// Handles the logged-in user's own profile: view, update, and delete.

const { User, Document } = require("../models");

function stripPassword(user) {
  if (!user) return null;
  const userJson = user.toJSON ? user.toJSON() : { ...user };
  const { password, ...safeUser } = userJson;
  return safeUser;
}

async function getMe(req, res) {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: stripPassword(user),
    });
  } catch (error) {
    console.log("error in getMe", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function updateMe(req, res) {
  try {
    const { name, email } = req.body;

    if (name === undefined && email === undefined) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: stripPassword(user),
    });
  } catch (error) {
    console.log("error in updateMe", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function deleteMe(req, res) {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Cascade deletions manually to ensure consistency
    await Document.destroy({ where: { userId: user.id } });
    await user.destroy();

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
      data: {},
    });
  } catch (error) {
    console.log("error in deleteMe", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = { getMe, updateMe, deleteMe };
