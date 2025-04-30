import React, { useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const VideoCall = () => {
  const [isInCall, setIsInCall] = useState(false);
  const containerRef = useRef(null);
  const zpRef = useRef(null);
  const startCall = () => {
    setIsInCall(true);
  };
  useEffect(() => {
    const appID = 1200491289;
    const serverSecret = "1153c786a3deb2aa6e14b692bbb71c1a";
    const userID = localStorage.getItem("userId") || String(Date.now());
    const roomId = localStorage.getItem("roomId") || "defaultRoom";
    const userName = "govind";

    if (isInCall && containerRef.current) {
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        userID,
        userName
      );
      zpRef.current = ZegoUIKitPrebuilt.create(kitToken);
      zpRef.current.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
        layout: "Grid",
        showLayoutButton: false,
        showPreJoinView: false,
        showRoomTimer: false,
        showScreenSharingButton: false,
        showRoomDetailsButton: false,
        showUserList: false,
        showMoreButton: false,
        showTextChat: false,
        showLeaveRoomConfirmDialog: false,
      });
      // Apply styling after short delay
      setTimeout(() => {
        const videoWrappers = containerRef.current.querySelectorAll(
          ".zego-video-layer, .zego-user-video"
        );
        console.log(videoWrappers);
        videoWrappers.forEach((el) => {
          el.style.maxWidth = "400px";
          el.style.borderRadius = "1rem";
          el.style.overflow = "hidden";
        });

        const video = containerRef.current.querySelector("video");
        if (video) {
          video.style.borderRadius = "1rem";
          video.style.objectFit = "cover";
          video.style.width = "80%";
          video.style.height = "auto";
        }
      }, 100); // Wait for DOM render
    }
    return () => {
      zpRef.current?.destroy();
    };
  }, [isInCall]);
  return (
    <div className="w-full flex justify-center items-center p-4">
      {!isInCall ? (
        <button
          onClick={startCall}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Join
        </button>
      ) : (
        <div className=" rounded-xl shadow-lg" ref={containerRef}></div>
      )}
    </div>
  );
};
export default VideoCall;
