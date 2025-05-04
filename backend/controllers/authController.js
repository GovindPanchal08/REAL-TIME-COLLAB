const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

module.exports.registerUser = async function (req, res) {
  try {
    const { email, password, username } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Account already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      email,
      password: hashedPassword,
      username,
    });

    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports.loginUser = async function (req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", data: { user: user._id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports.profile = async function (req, res) {
  console.log(req.user);
  try {
    let { username, email } = req.body;
    let pic = req.file ? req.file.buffer : undefined;
    console.log(req.file);
    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    let id = req.user.id; // User ID from the authentication middleware
    console.log("User ID is:", id);

    // Build the updated data object
    let updatedData = {};
    if (username) updatedData.username = username;
    if (email) updatedData.email = email || req.user.email;
    if (pic) updatedData.pic = pic;

    // Update user in the database
    let user = await userModel.findOneAndUpdate({ _id: id }, updatedData, {
      new: true,
    });
    // If user is not found
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    // Respond with success and updated user
    return res
      .status(200)
      .json({ message: "Profile updated successfully.", user });
  } catch (error) {
    console.error(error.message); // Log the error
    return res
      .status(500)
      .json({ message: "An error occurred.", error: error.message });
  }
};
module.exports.logout = function (req, res) {
  res.cookie("token", "");
};
