const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

module.exports.registerUser = async function (req, res, next) {
  try {
    const { email, password, username } = req.body;

    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      console.log("got here");
      return res.status(400).json({ message: "Account already exists" });
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
    res
      .status(201)
      .json({ message: "User created successfully", userId: user._id });
  } catch (err) {
    next(err);
  }
};

module.exports.loginUser = async function (req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (err) {
    next(err);
  }
};

module.exports.profile = async function (req, res) {
  try {
    const { username, email, userId } = req.body;
    const pic = req.file ? req.file.buffer : undefined;

    const updatedData = {};
    if (username) updatedData.username = username;
    if (email) updatedData.email = email;
    if (pic) updatedData.pic = pic;

    const user = await userModel
      .findByIdAndUpdate(userId, updatedData, {
        new: true,
        runValidators: true,
      })
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully.", user });
  } catch (error) {
    // Let global error handler catch
    next(error);
  }
};
module.exports.logout = function (req, res) {
  res.cookie("token", "");
};
