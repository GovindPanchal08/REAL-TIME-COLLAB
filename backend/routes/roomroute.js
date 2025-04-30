const express = require("express");
const { addRoom, removeRoom } = require("../controllers/roomController");
const userModel = require("../models/user-model");
const roomModel = require("../models/room-model");
const router = express.Router();
let CODE_SNIPPETS;
import("../../frontend/src/Const/contant.js")
  .then((constants) => {
    CODE_SNIPPETS = constants.CODE_SNIPPETS;
  })
  .catch((err) => {
    console.error("Error importing module:", err);
  });

router.post("/add-room", addRoom);
router.post("/remove-room", removeRoom);
router.get("/get-rooms/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await userModel.findById(userId).populate("rooms");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    if (!user.rooms) {
      return res.json({ message: "No Rooms" });
    }
    res.status(200).json({ data: user.rooms });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});
// for as per room && language codes save and fetch
router.post("/save-code", async (req, res) => {
  const { roomid, language, code } = req.body;
  try {
    const room = await roomModel.findOne({ roomId: roomid });

    if (!room) {
      return res.status(404).json({ error: "Room not found." });
    }
    // 🔥 Use $set to update only the specific language inside `codes`
    await roomModel.updateOne(
      { roomId: roomid },
      { $set: { [`codes.${language}`]: code } }
    );

    res.status(200).json({ message: "Code saved successfully!" });
  } catch (error) {
    console.log("Error saving code:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/get-code/:roomid/:language", async (req, res) => {
  const { roomid, language } = req.params;

  try {
    const room = await roomModel.findOne({ roomId: roomid });

    if (!room) {
      return res.status(404).json({ error: "Room not found." });
    }

    // 🔥 Return only the requested language's code (or default)
    const code = room.codes?.get(language) || CODE_SNIPPETS[language];

    res.status(200).json({ data: code });
  } catch (error) {
    console.log("Error fetching code:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
