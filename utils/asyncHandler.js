const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      // Log the error for debugging
      console.error("❌ Async Handler Error:", err)

      // Send error response
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || [],
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
      })
    })
  }
}

module.exports = { asyncHandler }
