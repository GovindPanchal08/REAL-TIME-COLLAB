import React, { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";

const SocketContext = createContext();
const socket = io(import.meta.env.VITE_BACKEND_URL);
export const SocketProvider = ({ children }) => {
  const [state, setState] = useState({
    socket,
    socketId: localStorage.getItem("socketId") || null, // Retrieve socketId from localStorage
  });

  useEffect(() => {
    // Update socketId on connection
    socket.on("connect", () => {
      const id = socket.id;
      setState((prev) => ({ ...prev, socketId: id }));
      localStorage.setItem("socketId", id); // Save to localStorage
    });

    // Update socketId on reconnection
    socket.on("reconnect", () => {
      const id = socket.id;
      setState((prev) => ({ ...prev, socketId: id }));
      localStorage.setItem("socketId", id); // Update localStorage
    });

    return () => {
      socket.off("connect");
      socket.off("reconnect");
    };
  }, []);

  return (
    <SocketContext.Provider value={state}>{children}</SocketContext.Provider>
  );
};
export const useSocket = () => useContext(SocketContext);

// userContext
const userContext = createContext();
export const UserProvider = ({ children }) => {
  const { socket } = useSocket();
  const [userName, setuserName] = useState(
    localStorage.getItem("username") || null
  );
  const [email, setemail] = useState("");
  const [pic, setpic] = useState("");
  useEffect(() => {
    if (socket) {
      socket.on("userData", ({ user, picBase64 }) => {
        const { username, email } = user;
        setemail(email);
        setuserName(username);
        localStorage.setItem("username", userName);
        setpic(picBase64);
      });
    }
    return () => {
      socket.off("userData");
    };
  }, [socket, userName, email, pic]);
  return (
    <userContext.Provider value={{ userName, email, pic }}>
      {children}
    </userContext.Provider>
  );
};
export const userData = () => useContext(userContext);
