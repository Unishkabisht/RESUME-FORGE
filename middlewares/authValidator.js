/**
 * @file authValidator.js
 * @description Express middleware to validate JWT authorization headers.
 */

const jwt = require("jsonwebtoken");

/**
 * Validate JWT token from Authorization header and attach userId to request.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware callback
 */
function authValidator(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token required",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.error("authValidator error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
}

module.exports = authValidator;
