const mongoose = require("mongoose");
const roomModel = require("../models/room-model");
const userModel = require("../models/user-model");

module.exports.addRoom = async (req, res) => {
  const { userId, roomid } = req.body;
  try {
    // console.log(userId, roomid);
    let room = await roomModel.findOne({ roomId: roomid });
    if (!room) {
      room = new roomModel({
        roomId: roomid,
        participants: [userId],
      });
      await room.save();
    } else {
      if (!room.participants.includes(userId)) {
        room.participants.push(userId);
        await room.save();
      }
    }
    // console.log(room);

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    if (!user.rooms.includes(room._id)) {
      // const validRoomId = mongoose.Types.ObjectId.isValid(roomId)
      //   ? mongoose.Types.ObjectId(roomId)
      //   : null;
      const validRoomId = room._id;
      // console.log(validRoomId);
      user.rooms.push(validRoomId);
      await user.save();
    }
    res.status(200).json({ message: "Room added successfully.", room });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports.removeRoom = async (req, res) => {
  const { userId, roomid } = req.body;
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Remove the roomId from the user's roomId array
    user.rooms = user.rooms.filter((id) => {
      console.log(id);
      id.toString() !== roomid;
    });
    await user.save();
    res
      .status(200)
      .json({ message: "Room removed successfully.", roomId: roomid });
  } catch (error) {
    console.error("Error removing room:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
