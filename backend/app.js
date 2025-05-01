//Basics
const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { exec } = require("child_process");
const fs = require("fs");
const app = express();
const server = http.createServer(app);
require("dotenv").config();
const io = new Server(server, {
  cors: {
    origin: `${process.env.FRONTEND_URL}`, // Allow your frontend's origin
    methods: ["GET", "POST"], // Allowable methods
    credentials: true, // Allow credentials (cookies, etc.)
  },
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//router

//db connection
const db = require("./config/mongoose-connection");
const usersRoutes = require("./routes/userRoute");
const roomRoute = require("./routes/roomroute");
const airoute = require("./routes/airoute");
// const { isLoggedin } = require("./middleware/isLoggedin");
//corss setup
app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get("/", async (req, res) => {
  res.send("heyy");
});
const SAVE_DIR = path.join(__dirname, "savedFiles");
// Ensure the directory exists
if (!fs.existsSync(SAVE_DIR)) {
  fs.mkdirSync(SAVE_DIR, { recursive: true });
}
app.post("/save-open-vscode", async (req, res) => {
  const { fileName, code } = req.body;
  // Validate input
  if (!fileName || !code) {
    console.log("file needed");
    return res.status(400).json({ error: "Filename and content are required" });
  }
  const filePath = path.join(SAVE_DIR, fileName);
  fs.writeFileSync(filePath, code, (err) => {
    if (err) {
      // console.log(err.message);
      return res.status(500).json({ error: "Failed to save file" });
    }
  });
  // console.log(`File saved at: ${filePath}`);
  exec(`code ${filePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).json({ error: "Failed to open file in VS Code" });
    }
    return res.json({
      message: "File saved and opened in VS Code",
      // path: filePath,
    });
    console.error(`stderr: ${stderr}`);
  });
});

const { handleSocket } = require("./controllers/socketController");
handleSocket(io);
app.use("/user", usersRoutes);
app.use("/room", roomRoute);
app.use("/ai", airoute);

//running
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
