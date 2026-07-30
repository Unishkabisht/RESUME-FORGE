/**
 * @file userController.js
 * @description Controller for logged-in user profile operations.
 */

const { User, Document } = require("../models");

/**
 * Remove sensitive password attribute before returning user object.
 * @param {Object} user - User instance
 * @returns {Object} Safe user object
 */
function sanitize(user) {
  if (!user) return null;
  const raw = user.toJSON ? user.toJSON() : { ...user };
  const { password, ...safe } = raw;
  return safe;
}

/**
 * Fetch authenticated user profile.
 * @route GET /api/users/me
 */
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
      message: "Profile fetched",
      data: sanitize(user),
    });
  } catch (error) {
    console.error("getMe error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * Update authenticated user profile.
 * @route PUT /api/users/me
 */
async function update(req, res) {
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
      message: "Profile updated",
      data: sanitize(user),
    });
  } catch (error) {
    console.error("update user error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * Delete authenticated user account and associated documents.
 * @route DELETE /api/users/me
 */
async function remove(req, res) {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await Document.destroy({ where: { userId: user.id } });
    await user.destroy();

    return res.status(200).json({
      success: true,
      message: "Account deleted",
      data: {},
    });
  } catch (error) {
    console.error("remove user error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  getMe,
  update,
  remove,
};
