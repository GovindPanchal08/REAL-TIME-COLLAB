const mongoose = require("mongoose");
const roomModel = require("../models/room-model");
const userModel = require("../models/user-model");

module.exports.addRoom = async (req, res, next) => {
  const { userId, roomid } = req.body;
  try {
    let room = await roomModel.findOne({ roomId: roomid }).lean();
    if (!room) {
      room = new roomModel({
        roomId: roomid,
        participants: [userId],
      });
      await room.save();
    } else if (!room.participants.includes(userId)) {
      room = await roomModel.findById(room._id);
      room.participants.push(userId);
      await room.save();
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.rooms.includes(room._id)) {
      user.rooms.push(room._id);
      await user.save();
    }
    res.status(200).json({ message: "Room added successfully.", room: room._id });
  } catch (error) {
    next(error);
  }
};

module.exports.removeRoom = async (req, res, next) => {
  const { userId, roomid } = req.body;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.rooms = user.rooms.filter((id) => id.toString() !== roomid);
    await user.save();
    res.status(200).json({ message: "Room removed successfully.", roomId: roomid });
  } catch (error) {
    next(error);
  }
};

