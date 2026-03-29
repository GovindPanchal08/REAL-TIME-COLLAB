const mongoose = require("mongoose");
const messageSchema = mongoose.Schema({
  senderName: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, index: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });
const roomSchema = mongoose.Schema({
  roomId: { type: String, required: true, unique: true, index: true },
  codes: { type: Map, of: String, default: {} },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  messages: [messageSchema],
}, { timestamps: true });

roomSchema.index({ "messages.timestamp": -1 });
roomSchema.index({ participants: 1 });
module.exports = mongoose.model("room", roomSchema);
