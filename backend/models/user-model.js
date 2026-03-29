const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "room" }],
  pic: { type: Buffer },
}, { timestamps: true });

userSchema.index({ email: 1 });
userSchema.index({ rooms: 1 });
module.exports = mongoose.model("user", userSchema);
