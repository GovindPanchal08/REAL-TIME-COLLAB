const mongoose = require("mongoose");
mongoose
  .connect(`${process.env.MONGODB_URI}`, {
    // bufferCommands: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(function () {
    console.log("MongoDB connected successfully");
  })
  .catch(function (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

module.exports = mongoose.connection;
