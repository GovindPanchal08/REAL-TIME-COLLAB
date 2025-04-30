import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSocket } from "../../Context/context.jsx";
import { getUserColor } from "../../Const/contant.js";
import { useSettings } from "../../Context/SettingsContext.jsx";

const ResizableSplit = ({ leftContent, rightContent, showCursors }) => {
  const { socket, socketId } = useSocket();
  const { isOpen } = useSettings();
  const [roomId, setroomId] = useState(null);
  const containerRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const resizerRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const MIN_WIDTH = 150; // Minimum width for both sections

  const cursorTimeoutsRef = useRef({});
  useEffect(() => {
    if (!socket) return;
    const roomid = localStorage.getItem("roomId");
    setroomId(roomid);
    const leftBar = document.querySelector(".left"); // Cache sidebar element
    const handleCursor = ({ id, x, y, username }) => {
      if (!leftBar) return;

      let cursor = document.getElementById(`cursor-${id}`);
      if (!cursor) {
        cursor = document.createElement("div");
        cursor.id = `cursor-${id}`;
        cursor.classList.add("remote-cursor");
        cursor.innerHTML = `<span class="cursor-circle">${username}</span>`;
        leftBar.appendChild(cursor);

        const color = getUserColor(id);
        cursor.querySelector(".cursor-circle").style.backgroundColor = color;
        cursor.style.setProperty("--cursor-color", color);
        // cursor.querySelector(".cursor-circle").style.backgroundColor = color;
      }
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;

      // Reset timeout for cursor disappearance
      if (cursorTimeoutsRef.current[id])
        clearTimeout(cursorTimeoutsRef.current[id]);

      cursorTimeoutsRef.current[id] = setTimeout(() => {
        cursor?.classList.add("fade-out"); // Add fade-out class for smooth transition
        setTimeout(() => cursor?.remove(), 500); // Remove after transition
      }, 500);
    };
    if (showCursors) {
      socket.on("update-cursor", handleCursor);
    } else {
      document
        .querySelectorAll(".remote-cursor")
        .forEach((cursor) => cursor.remove());
      socket.off("update-cursor", handleCursor);
    }

    return () => {
      socket.off("update-cursor", handleCursor);
      Object.values(cursorTimeoutsRef.current).forEach(clearTimeout);
    };
  }, [socket, roomId, showCursors]);

  const handleMouseMov = (e) => {
    if (!roomId) return;
    const cursorData = {
      id: socketId,
      roomId,
      x: e.clientX,
      y: e.clientY,
    };
    if (socket) {
      socket.emit("cursor-move", cursorData);
    }
  };
  // resizer
  const handleMouseDown = (e) => {
    setIsResizing(true);
  };
  const handleMouseMove = (e) => {
    if (!isResizing) return;

    const containerWidth = containerRef.current.offsetWidth;
    let leftWidth = e.clientX - containerRef.current.offsetLeft;

    if (leftWidth < MIN_WIDTH) leftWidth = MIN_WIDTH;
    if (leftWidth > containerWidth - MIN_WIDTH)
      leftWidth = containerWidth - MIN_WIDTH;

    const rightWidth = containerWidth - leftWidth;

    if (leftRef.current && rightRef.current && resizerRef.current) {
      leftRef.current.style.width = `${leftWidth}px`;
      rightRef.current.style.width = `${rightWidth}px`;
      resizerRef.current.style.left = `${leftWidth}px`;
    }
  };
  const handleMouseUp = () => {
    setIsResizing(false);
  };
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  //cursorMovement
  useEffect(() => {
    if (roomId && leftRef.current)
      leftRef.current.addEventListener("mousemove", handleMouseMov);
    return () => {
      if (roomId && leftRef.current) {
        leftRef.current.removeEventListener("mousemove", handleMouseMov);
      }
      Object.values(cursorTimeoutsRef.current).forEach((timeout) =>
        clearTimeout(timeout)
      );
    };
  }, [roomId, socketId, leftRef,handleMouseMov]);

  return (
    <div
      ref={containerRef}
      className={`resizable-container flex ${
        !isOpen ? "w-[100vw]" : "w-[calc(95vw-18rem)]"
      } h-[99vh]  transition-transform ease-in duration-75 relative`}
    >
      <div className="absolute flex  gap-3 h-full w-full">
        <div
          ref={leftRef}
          className={`left h-full w-full `}
          style={{ width: "70%" }}
        >
          {leftContent}
        </div>
        {/* Resizer */}
        <div
          ref={resizerRef}
          onMouseDown={handleMouseDown}
          className="resizer bg-[#ccc]  hover:bg-blue-500  hover:transition-all hover:ease-in-out hover:duration-300 rounded-sm"
          style={{
            width: "5px",
            cursor: "col-resize",
            position: "absolute",
            top: 0,
            right: "50%",
            overflowY: "hidden",
            bottom: 0,
            left: "70%", // Initially center it
            transform: "translateX(-50%)",
          }}
        ></div>

        {/* Right Content */}
        <div ref={rightRef} className="h-full w-full " style={{ width: "30%" }}>
          {rightContent}
        </div>
      </div>
    </div>
  );
};

ResizableSplit.propTypes = {
  leftContent: PropTypes.node.isRequired,
  rightContent: PropTypes.node.isRequired,
  initialLeftWidth: PropTypes.string,
};

export default ResizableSplit;
