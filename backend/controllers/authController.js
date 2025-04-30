const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

module.exports.ragisterUser = async function (req, res) {
  try {
    let { email, password, username } = req.body;
    let users = await userModel.findOne({ email: email });
    if (users) {
      return res.json({ error: "already have an account" });
    }
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return console.log(err);
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) return res.send(err);
        else {
          let user = await userModel.create({
            email,
            password: hash,
            username,
          });
          let token = generateToken(user);
          res.cookie("token", token, {
            httpOnly: true, // Prevent client-side access
            secure: process.env.NODE_ENV === "production", // Secure in production
            sameSite: "strict", // Prevent CSRF attacks
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
          res.json({ message: "user created succesfully" });
        }
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};
module.exports.loginUser = async function (req, res) {
  try {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email: email });
    if (!user) {
      return res.json({ error: "email or password incorrect" });
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        let token = generateToken(user);
        res.cookie("token", token);

        res.status(200).json({
          message: "Successfully Login",
          data: { user: user.id, token },
        });
      } else {
        res.json({ error: "password did not match" });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.profile = async function (req, res) {
  try {
    let { username, email, password, newpassword } = req.body;
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

    // Handle password change
    if (password && newpassword) {
      let isMatch = await bcrypt.compare(password, req.user.password);
      console.log("Password match:", isMatch);

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect." });
      }
      updatedData.password = await bcrypt.hash(newpassword, 10);
    }

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
