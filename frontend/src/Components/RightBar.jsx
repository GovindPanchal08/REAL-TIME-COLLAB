import React, { useState, useRef, lazy, Suspense } from "react";
const VideoCall = lazy(() => import("./Chat/Video.jsx"));

import video from "../assets/video-calling.png";
const RightBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const videoContainerRef = useRef(null);

  return (
    <div className="z-10">
      <Suspense fallback={<div></div>}>
        {/* Video Call Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 fixed bottom-5 right-5 bg-blue-500 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300"
        >
          <img
            src={video}
            alt="Video Call"
            className="w-7 h-7"
            loading="lazy"
          />
        </button>

        {/* Video Call Panel */}
        <div
          className={`absolute w-full  md:w-[40vw] h-full top-0 right-0  bg-[#1e1e2f] transform transition-transform duration-500 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex p-4 items-center gap-2">
            <h2 className="text-2xl font-semibold text-white">
              Group Video Call
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto text-xl text-white hover:text-gray-400 transition-all"
            >
              ✕
            </button>
          </div>

          <div className="w-full h-screen">
            <div className="w-full  h-[90vh] rounded-2xl overflow-hidden shadow-xl ">
              <VideoCall containerRef={videoContainerRef} />
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default RightBar;
