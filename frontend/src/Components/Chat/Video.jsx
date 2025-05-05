import React, { useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { userData } from "../../Context/context";

const VideoCall = () => {
  const [isInCall, setIsInCall] = useState(false);
  const { userName } = userData();
  const containerRef = useRef(null);
  const zpRef = useRef(null);
  const startCall = () => {
    setIsInCall(true);
  };
  useEffect(() => {
    const appID = import.meta.env.VITE_APP_ID;
    const serverSecret = import.meta.env.VITE_SERVER_KEY;
    const userID = localStorage.getItem("userId") || String(Date.now());
    const roomId = localStorage.getItem("roomId") || "defaultRoom";
    const username = userName;

    if (isInCall && containerRef.current) {
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        Number(appID),
        serverSecret,
        roomId,
        userID,
        username
      );
      zpRef.current = ZegoUIKitPrebuilt.create(kitToken);
      zpRef.current.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
        layout: "Grid",
        showLayoutButton: false,
        showSettingButton: false,
        showAudioButton: false,
        showPreJoinView: false,
        showRoomTimer: false,
        showScreenSharingButton: false,
        showRoomDetailsButton: false,
        showUserList: false,
        showMoreButton: false,
        showTextChat: false,
        showLeaveRoomConfirmDialog: false,
        videoScreenConfig: {
          objectFit:  "contain"// 视频画面显示模式，默认 "contain"
        }
      });
      // Apply styling after short delay
      setTimeout(() => {
        const moreBtn = containerRef.current.querySelector('[class*="more"]');
        if (moreBtn) {
          moreBtn.style.display = "none";
        }

        const settingsBtn =
          containerRef.current.querySelector('[class*="setting"]');
        if (settingsBtn) {
          settingsBtn.style.display = "none";
        }
        const videoWrappers = containerRef.current.querySelectorAll(
          ".zego-video-layer, .zego-user-video"
        );
        console.log(videoWrappers);
        videoWrappers.forEach((el) => {
          el.style.maxWidth = "400px";
          el.style.width = "50%";
          el.style.borderRadius = "1rem";
          el.style.overflow = "hidden";
        });

        const video = containerRef.current.querySelector("video");
        if (video) {
          video.style.borderRadius = "1rem";
          video.style.objectFit = "cover";
          video.style.height = "auto";
        }
      }, 100); // Wait for DOM render
    }
    return () => {
      zpRef.current?.destroy();
    };
  }, [isInCall, userName]);
  return (
    <div className="flex items-center justify-center">
      {!isInCall ? (
        <button
          onClick={startCall}
          className="px-4 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Join
        </button>
      ) : (
        <div className="" ref={containerRef}></div>
      )}
    </div>
  );
};
export default VideoCall;
