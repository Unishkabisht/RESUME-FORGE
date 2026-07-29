const jwt = require("jsonwebtoken");

function authValidator(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token is required"
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is required"
      });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // attach user id to request
    req.userId = decoded.id;
    
    next();
  } catch (error) {
    console.log("error in authValidator", error);
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
}

module.exports = authValidator;
