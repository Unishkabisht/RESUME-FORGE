/**
 * @file documentValidator.js
 * @description Express middleware to validate document parameter presence.
 */

/**
 * Validate document ID route parameter presence.
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware callback
 */
function documentValidator(req, res, next) {
  try {
    const { id } = req.params;

    if (id === undefined) {
      return res.status(400).json({
        success: false,
        message: "Document ID required",
      });
    }

    next();
  } catch (error) {
    console.error("documentValidator error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = documentValidator;
