function documentValidator(req, res, next) {
  try {
    const { id, sectionId, itemId } = req.params;
    
    if (id === undefined) {
      return res.status(400).json({
        success: false,
        message: "Document ID is required"
      });
    }

    next();
  } catch (error) {
    console.log("error in documentValidator", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}

module.exports = documentValidator;
