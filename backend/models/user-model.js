const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  // fullname: String,
  username: String,
  email: { type: String, required: true },
  password: String,
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "room" }],
  pic: {
    type: Buffer,
  },
});

module.exports = mongoose.model("user", userSchema);
