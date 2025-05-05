import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData, SendData } from "../Const/api.js";
import { getCookie } from "../Const/contant.js";
import Plus from "../assets/online-meeting (1).png";
import { features } from "../Const/contant.js";
const RoomEntry = ({ token }) => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [roomid, setRoomId] = useState("");
  const [rooms, setRooms] = useState([]);

  const handleJoinRoom = async (roomid) => {
    if (roomid.trim()) {
      try {
        const res = await SendData("/room/add-room", {
          userId,
          roomid,
        });
        localStorage.setItem("roomId", roomid);
        navigate(`/room/${roomid}`);
      } catch (error) {
        console.error("Failed to save room ID:", error);
      }
    } else {
      alert("Please enter a valid Room ID.");
    }
  };

  const handleRemoveRoom = async (roomid) => {
    try {
      const res = await SendData("/room/remove-room", { userId, roomid });

      if (res.roomId) {
        setRooms((prevRooms) =>
          prevRooms.filter((room) => room.roomId !== res.roomId)
        );
      }
    } catch (error) {
      console.error("Failed to remove room:", error);
    }
  };

  useEffect(() => {
    const fetchRoom = async () => {
      const userId = window.localStorage.getItem("userId");
      try {
        let res = await fetchData(`/room/get-rooms/${userId}`);
        setRooms(res.data);
      } catch (error) {
        console.error("Failed to fetch room ID:", error.message);
      }
    };

    const TokenFetch = async () => {
      const token = getCookie("token");
      if (token) {
        try {
          const res = await fetchData("/user/validate", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.message === "No token provided") {
            navigate("/login");
          }
        } catch (error) {
          console.error("Failed to validate token:");
        }
      }
    };

    const initializeData = async () => {
      if (!roomid) {
        await Promise.all([TokenFetch(), fetchRoom()]);
      }
    };

    initializeData();
  }, [roomid, navigate]);

  return (
    <>
      <p className="md:hidden text-sm text-center text-red-500 font-semibold ">
        For Better Experience Use Laptop
      </p>
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 text-gray-900 flex flex-col items-center p-6">
        <nav className="w-full flex justify-between items-center px-4 md:px-16 py-2  rounded-lg">
          <div className="">
            <h1 className="text-[2rem] shadow-sm shadow-blue-100 rounded-md md:text-[2.5rem] font-medium tracking-tighter">
              Code<span className="text-blue-500">ify</span>
            </h1>
          </div>
          <div className="flex gap-2 items-center">
            {!token && (
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => navigate("/ragister")}
                  className="text-blue-600 text-base hover:underline transition duration-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-base bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Log In
                </button>
              </div>
            )}
          </div>
        </nav>

        <main className="w-full max-w-3xl text-center mt-10">
          <h2 className=" text-[1.8rem] md:text-[2.3rem] font-medium">
            Code{" "}
            <sup className="text-blue-600 text-[1.8rem] md:text-[2.5rem] shadow-md rounded-xl px-3 py-2">
              Together
            </sup>{" "}
            Anytime, Anywhere
          </h2>
          <p className="text-[1rem] md:text-[1.3rem] font-normal text-gray-500 leading-relaxed">
            Seamless real-time coding collaboration.
          </p>

          <div className="mt-6 flex flex-col md:flex-row justify-center gap-4">
            <button
              className="flex items-center bg-blue-500 hover:bg-blue-600 hover:scale-95 text-white rounded-xl active:scale-90 transform transition-transform px-4 py-2"
              onClick={() => handleJoinRoom(roomid)}
            >
              <div className="flex gap-2">
                <img
                  className="w-6 h-6"
                  src={Plus}
                  alt="Plus Icon"
                  loading="laxy"
                />
                <h3 className="font-medium text-sm">New Meeting</h3>
              </div>
            </button>
            <input
              type="text"
              placeholder="Enter Room ID"
              className="rounded-xl px-4 py-3 font-medium text-base bg-slate-100 border border-gray-300 focus:outline-blue-600 transition duration-200"
              value={roomid}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button
              disabled={!roomid.trim()}
              className={`px-4 py-2 font-medium rounded-3xl transition duration-200 ${
                !roomid.trim()
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              onClick={() => handleJoinRoom(roomid)}
            >
              Join
            </button>
          </div>

          <h3 className="text-2xl font-medium mt-5 md:mt-20">
            Available Rooms
          </h3>
          <div className="mt-5 flex flex-wrap justify-center gap-4">
            {rooms.length > 0 ? (
              rooms.map((room, i) => (
                <div key={i} className="relative group">
                  <button
                    key={room.roomId}
                    className="px-4 py-2 tracking-tight hover:scale-95 bg-teal-500 text-white rounded-md font-medium hover:bg-teal-600 transition duration-200"
                    onClick={() => handleJoinRoom(room.roomId)}
                  >
                    Room {room.roomId}
                  </button>
                  <span
                    onClick={() => handleRemoveRoom(room.roomId)}
                    className="absolute cursor-pointer top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    X
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No rooms available</p>
            )}
          </div>
        </main>

        <div className="w-full overflow-hidden whitespace-nowrap shadow-sm py-3 mt-20   rounded-lg">
          <div className="flex space-x-8 w-max animate-marquee">
            {features.concat(features).map((feature, index) => (
              <div
                key={index}
                className="p-4  bg-gray-100 rounded-lg flex items-center space-x-4 w md:min-w-[250px] shadow-md transition-transform transform hover:scale-105"
              >
                <img
                  loading="lazy"
                  src={feature.img}
                  alt={feature.title}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomEntry;
