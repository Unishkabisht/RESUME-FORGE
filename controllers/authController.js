/**
 * @file authController.js
 * @description Authentication controller for user registration, login, and password resets.
 */

const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * Register a new user account.
 * @route POST /api/auth/register
 */
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const exists = await User.count({ where: { email } });
    if (exists > 0) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({ name, email, password });

    return res.status(201).json({
      success: true,
      message: "User registered",
      data: { userId: user.id },
    });
  } catch (error) {
    console.error("register error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
}

/**
 * Authenticate user and issue JWT token.
 * @route POST /api/auth/login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const profile = { id: user.id, email: user.email, name: user.name };
    const token = jwt.sign(profile, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: { token, user: profile },
    });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * Reset authenticated user password.
 * @route POST /api/auth/reset-password
 */
async function resetPass(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Password fields missing",
      });
    }

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const isValid = bcrypt.compareSync(oldPassword, user.password || "");
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect current password",
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset",
    });
  } catch (error) {
    console.error("resetPass error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  register,
  login,
  resetPass,
};
