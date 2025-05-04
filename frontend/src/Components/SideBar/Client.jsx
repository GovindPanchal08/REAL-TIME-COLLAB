import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSocket } from "../../Context/context";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import copyIcon from "../../assets/copy.png";
import shareIcon from "../../assets/share (1).png";
import logoutIcon from "../../assets/logout.png";

const Client = () => {
  const { socket } = useSocket();
  const { roomid } = useParams();
  const navigate = useNavigate();
  const userId = window.localStorage.getItem("userId");
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = (data) => setOnlineUsers(data);

    socket.on("online-users", handleOnlineUsers);

    return () => {
      socket.off("online-users", handleOnlineUsers);
    };
  }, [socket, onlineUsers]);

  const handleLeave = useCallback(() => {
    if (socket) {
      socket.emit("leave-room", { roomid, userId });
      navigate("/");
    }
  }, [socket, roomid, userId, navigate]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Room link copied to clipboard!");
  }, []);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator
        .share({
          title: "Room Invitation",
          text: `Join this room: ${window.location.origin}/room/${roomid}`,
        })
        .catch((error) => console.error("Error sharing", error));
    } else {
      alert("Share is not supported on this platform.");
    }
  }, [roomid]);

  const renderParticipants = useMemo(
    () =>
      onlineUsers.map((user, i) => {
        const profilePic = user.pic
          ? `data:image/jpeg;base64,${user.pic}`
          : "/src/assets/public/images/profile.png";

        return (
          <div key={i} className="relative flex flex-col items-center">
            <div className="relative">
              <img
                className="w-14 h-14 object-cover object-[0%,10%] rounded-3xl"
                src={profilePic}
                alt="profile"
              />
              <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <h6 className="text-md font-medium tracking-tight mt-1">
              {user.name}
            </h6>
          </div>
        );
      }),
    [onlineUsers]
  );

  return (
    <div>
      <div className="mt-2">
        <div className="flex items-center">
          <h5 className="text-2xl font-medium tracking-tight">Participants</h5>
          <span className="ml-32 font-semibold text-lg">
            {onlineUsers.length}
          </span>
        </div>
        <div className="h-[.5px] bg-gray-300 opacity-25 my-[1.04rem]"></div>
      </div>

      <div className="grid grid-cols-2 gap-2">{renderParticipants}</div>

      <div className="md:absolute bottom-1 mx-10 md:mx-4 my-4 flex gap-[4rem]">
        <button onClick={handleCopy} className="w-7 h-7">
          <img src={copyIcon} alt="Copy" loading="lazy" />
        </button>
        <button onClick={handleShare} className="w-7 h-7">
          <img src={shareIcon} alt="Share" loading="lazy" />
        </button>
        <button onClick={handleLeave} className="w-8 h-8">
          <img src={logoutIcon} alt="Logout" loading="lazy" />
        </button>
      </div>
    </div>
  );
};

export default Client;
