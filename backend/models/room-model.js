const mongoose = require("mongoose");
const messageSchema = mongoose.Schema({
  senderName: { type: String },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
const roomSchema = mongoose.Schema({
  roomId: { type: String, required: true, unique: true }, // Unique room ID
  codes: { type: Map, of: String, default: {} }, // To store the room's code content
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }], // Array of user references
  messages: [messageSchema],
});

module.exports = mongoose.model("room", roomSchema);
