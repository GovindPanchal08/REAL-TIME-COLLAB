const userModel = require("../models/user-model");
const roomModel = require("../models/room-model");

const onlineUsers = {};
const userSockets = {};
const activeParticipants = {};

const handleSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    // Join room
    socket.on("join-room", async ({ roomid, userId }) => {
      userSockets[userId] = socket.id;
      socket.roomid = roomid; // Store room ID on the socket for disconnection tracking

      console.log(`User ${userId} joined room ${roomid}`);
      socket.join(roomid);
      io.to(roomid).emit("user-joined", { socketId: socket.id, roomid });
      // Fetch user details from database

      const user = await userModel.findById(userId);
      const picBase64 =
        user?.pic instanceof Buffer ? user?.pic.toString("base64") : user?.pic;
      socket.emit("userData", { user, picBase64 });
      if (!user) {
        console.log("User not found.");
        return;
      }
      // Initialize online users list if not already created
      if (!onlineUsers[roomid]) {
        onlineUsers[roomid] = [];
      }
      // Add user to online users if they are not already in the list
      if (!onlineUsers[roomid].find((u) => u.userId === userId)) {
        onlineUsers[roomid].push({
          userId,
          name: user.username,
          pic: picBase64,
        });
      }
      // Emit updated online users list to everyone in the room
      const data = onlineUsers[roomid];
      const roomDetail = await roomModel.findOne({ roomId: roomid });
      io.to(roomid).emit("online-users", data, roomid, roomDetail);

      // Handle code change
      socket.on("code-change", (code) => {
        socket.to(roomid).emit("receive-code", code); // Send code to all users in the room
      });

      // Handle cursor position change
      socket.on("cursor-move", (cursorData) => {
        socket.to(cursorData.roomId).emit("update-cursor", {
          id: socket.id,
          x: cursorData.x,
          y: cursorData.y,
          username: user.fullname || user.username,
        });
      });

      socket.on("typing", ({ roomid, lineNumber, userName, socketId }) => {
        // Broadcast the typing event to others in the room
        socket.to(roomid).emit("typing", {
          userId: socket.id,
          lineNumber,
          userName,
        });
      });

      // Handle stop-typing events
      socket.on("stop-typing", ({ roomid, userId }) => {
        socket.to(roomid).emit("stop-typing", { userId });
      });

      // handling send and recive msg and history
      const room = await roomModel.findOne({ roomId: roomid }).populate({
        path: "messages",
        populate: {
          path: "sender",
          select: ["fullname", "_id"],
        },
      });

      if (room && room.messages) {
        socket.emit("room-data", room);

        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentMessages = room.messages.filter(
          (msg) => new Date(msg.timestamp) > oneDayAgo
        );
        socket.emit("chat-history", recentMessages);
      }

      // Handle leave room
      socket.on("leave-room", ({ roomid, userId }) => {
        console.log("room leave", roomid, "with", userId);

        if (onlineUsers[roomid]) {
          // Remove user from online users list for the room
          onlineUsers[roomid] = onlineUsers[roomid].filter(
            (u) => u.userId !== userId
          );

          // Emit updated online users list to the room
          io.to(roomid).emit("online-users", onlineUsers[roomid]);
        }
        socket.leave(roomid);
      });
      // Handle disconnection
      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        const roomId = socket.roomid; // Retrieve room ID from socket
        if (roomId && onlineUsers[roomId]) {
          // Remove user from online users list for the room
          onlineUsers[roomId] = onlineUsers[roomId].filter(
            (u) => u.userId !== userId
          );

          // Emit updated online users list to the room
          io.to(roomId).emit("online-users", onlineUsers[roomId]);
          io.to(roomId).emit("user-left", socket.id); // Notify others in the room
        }

        // Remove the user from all rooms they were part of
        for (const roomId in activeParticipants) {
          if (activeParticipants[roomId].includes(socket.id)) {
            activeParticipants[roomId] = activeParticipants[roomId].filter(
              (id) => id !== socket.id
            );

            // Notify others in the room
            socket.to(roomId).emit("call-ended", { userId: socket.id });

            // If no participants remain in the room
            if (activeParticipants[roomId].length === 0) {
              console.log(
                `No participants left in room ${roomId}. Cleaning up.`
              );
              delete activeParticipants[roomId];
              io.to(roomId).emit("call:ended:final", { roomId });
            }
          }
        }
      });
    });
    socket.on("send", async ({ message, userId, roomId }) => {
      try {
        const user = await userModel.findById(userId);
        const newMsg = {
          sender: userId,
          content: message,
          senderName: user?.fullname || user?.username,
          timestamp: new Date(),
        };

        let room = await roomModel.findOneAndUpdate(
          { roomId: roomId },
          { $push: { messages: newMsg } },
          { new: true }
        );

        if (room) {
          await room.save(); // Ensure changes are saved
          io.to(roomId).emit("received-msg", {
            roomId,
            userId,
            content: message,
            sender: { fullname: user.fullname || user.username },
            timestamp: new Date(),
          });
        }
      } catch (error) {
        console.error("Error handling message send:", error);
      }
    });
  });
};

module.exports = { handleSocket };
