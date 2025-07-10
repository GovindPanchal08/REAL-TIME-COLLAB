# 🧠 Real-Time Collaborative Code Editor

A full-stack web application enabling real-time code collaboration, integrated group video calls, and chat support—ideal for coding interviews, pair programming, or collaborative development sessions.

---

## 📌 Table of Contents
- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Team Contributions](#team-contributions)
- [Future Scope](#future-scope)
- [License](#license)

---

## 📖 About the Project

The **Real-Time Collaborative Code Editor** is a MERN-based full-stack application that allows multiple users to collaboratively write code with real-time synchronization. It includes live code preview, in-room chat, video conferencing, AI-assisted code suggestions, and more.

This project was developed as part of our final year submission and demonstrates advanced concepts in real-time systems, backend architecture, and frontend interactivity.

---

## ✨ Features

- 🔐 JWT-based User Authentication  
- 🏠 Room Creation & Joining (Socket.IO)  
- 🧑‍💻 Real-Time Collaborative Code Editing  
- 🎥 Video Calling (ZegoCloud SDK)  
- 💬 Integrated Group Chat  
- 🎨 Theme & Language Switching (Dark/Light, JS/HTML/CSS)  
- 📂 Code Downloading & Sharing  
- 🤖 AI Bot for Code Suggestions *(planned/ongoing)*  
- 📈 Real-Time Logs and Feedback  
- 🔁 Code Sync and Broadcast using WebSockets  

---

## 🛠 Tech Stack

**Frontend**
- React.js  
- Tailwind CSS  
- Socket.IO Client  
- ZegoCloud Web SDK  
- CodeMirror for editor  

**Backend**
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- Socket.IO Server  
- JWT Authentication  

**Other Tools**
- Git & GitHub  
- Chart.js *(for future analytics)*  
- ESLint + Prettier  
- Postman (API Testing)  

---

## 🧱 Architecture
Client (React) <---> WebSocket (Socket.IO) <---> Server (Node.js + Express) <---> MongoDB


---

---

## 🚀 Installation

```bash
# Clone the repository
git clone [https://github.com/your-username/realtime-code-editor.git](https://github.com/GovindPanchal08/REAL-TIME-COLLAB.git)
cd finalYear

# Backend
cd backend
npm install
 node app.js

# Frontend
cd frontend
npm install
npm run dev

---

##💡 Usage
Register/Login using your email.

Create or join a room using a room ID.

Start coding collaboratively with your teammates.

Enable video chat for team discussions.

Share code, download files, or ask AI for help!

---

##👥 Team Contributions
Our success was truly collaborative. No role had higher priority—we all contributed equally to create a robust final product.

---

##🧭 Future Scope
🧠 AI Assistant for debugging and autocompletion

📆 Code session recording and playback

🧵 Threaded comments for specific lines

🌐 Deployment with CI/CD pipeline

🔒 OAuth Integration

📊 Analytics Dashboard with Chart.js

---

