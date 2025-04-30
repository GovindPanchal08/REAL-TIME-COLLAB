const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports.isLoggedin = async function (req, res, next) {
  try {
    // Log cookies for debugging
    // console.log("Cookies:", req.cookies);

    // Check if the token exists
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "You need to log in first." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // Fetch the user using the ID from the decoded token
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Attach the user to the request object for further use
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Session expired. Please log in again." });
    } else if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "Invalid token. Please log in again." });
    }

    // Generic error response
    return res.status(500).json({ message: "Authentication failed." });
  }
};
