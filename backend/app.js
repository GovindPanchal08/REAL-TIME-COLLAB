//Basics
const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
// const ErrorHandler = require("./middlewares/errorHandler");
const app = express();
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
const server = http.createServer(app);
require("dotenv").config();
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // Allow your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowable methods
    credentials: true, // Allow credentials (cookies, etc.)
  },
});


app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"), { maxAge: '1d' }));

//db connection
const db = require("./config/mongoose-connection");
const usersRoutes = require("./routes/userRoute");
const roomRoute = require("./routes/roomroute");
const airoute = require("./routes/airoute");

// Ensure DB connected before socket/routes
db.on('connected', () => console.log('DB ready'));
db.on('error', (err) => {
  console.error('DB connection error:', err);
  process.exit(1);
});

//CORS setup
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  res.send("heyy");
});
// const SAVE_DIR = path.join(__dirname, "savedFiles");
// // Ensure the directory exists
// if (!fs.existsSync(SAVE_DIR)) {
//   fs.mkdirSync(SAVE_DIR, { recursive: true });
// }
// app.post("/save-open-vscode", async (req, res) => {
//   const { fileName, code } = req.body;
//   // Validate input
//   if (!fileName || !code) {
//     console.log("file needed");
//     return res.status(400).json({ error: "Filename and content are required" });
//   }
//   const filePath = path.join(SAVE_DIR, fileName);
//   fs.writeFileSync(filePath, code, (err) => {
//     if (err) {
//       // console.log(err.message);
//       return res.status(500).json({ error: "Failed to save file" });
//     }
//   });
//   // console.log(`File saved at: ${filePath}`);
//   exec(`code ${filePath}`, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`exec error: ${error}`);
//       return res.status(500).json({ error: "Failed to open file in VS Code" });
//     }
//     return res.json({
//       message: "File saved and opened in VS Code",
//       // path: filePath,
//     });
//     console.error(`stderr: ${stderr}`);
//   });
// });

const { handleSocket } = require("./controllers/socketController");
const ErrorHandler = require("./middlewares/errorHandler");
handleSocket(io);
app.use("/user", usersRoutes);
app.use("/room", roomRoute);
// app.use("/ai", airoute); // Commented chatbot

// Global error handler
app.use(ErrorHandler);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

//running
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
