const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const upload = require("../config/ṃulter-config");
const {
  registerUser,
  loginUser,
  logout,
  profile,
} = require("../controllers/authController");
const { isLoggedin } = require("../middlewares/isLoggedin");
const userModel = require("../models/user-model");

router.get("/", function (req, res) {
  res.send("hey its users ");
});

router.post("/ragister", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);

router.post("/profile", upload.single("photo"), profile);

router.get("/validate", isLoggedin, async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    return res.json({ isAuthenticated: true, user, token });
  });
});
module.exports = router;
