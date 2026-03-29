import React, { useRef, useState, useEffect, useCallback } from "react";
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
  const [leftWidth, setLeftWidth] = useState(70); // Initial %
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
  // resizer - fixed
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing || !containerRef.current) return;
    requestAnimationFrame(() => {
      const containerWidth = containerRef.current.offsetWidth;
      const rect = containerRef.current.getBoundingClientRect();
      let newLeftWidth = e.clientX - rect.left;

      if (newLeftWidth < MIN_WIDTH) newLeftWidth = MIN_WIDTH;
      if (newLeftWidth > containerWidth - MIN_WIDTH) newLeftWidth = containerWidth - MIN_WIDTH;

      const newRightWidth = containerWidth - newLeftWidth;

      if (leftRef.current) {
        leftRef.current.style.flex = `1 0 ${newLeftWidth}px`;
        leftRef.current.style.width = `${newLeftWidth}px`;
      }
      if (rightRef.current) {
        rightRef.current.style.flex = `1 0 ${newRightWidth}px`;
        rightRef.current.style.width = `${newRightWidth}px`;
      }
      if (resizerRef.current) {
        resizerRef.current.style.left = `${newLeftWidth}px`;
      }
      setLeftWidth((newLeftWidth / containerWidth) * 100);
    });
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    if (isResizing) {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      setIsResizing(false);
    }
  }, [isResizing]);
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

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
      className={`resizable-container flex  ${
        !isOpen ? "w-[100vw]" : "w-[calc(95vw-18rem)]"
      } h-[99vh]  transition-transform ease-in duration-75 relative`}
    >
      <div className="md:absolute md:flex space-y-1 md:space-y-0   gap-3 h-full w-full">
        <div
          ref={leftRef}
          className={`left mt-1 md:mt-0 h-[60%] md:h-full flex-1 min-w-[150px] transition-all duration-100 ${isResizing ? 'pointer-events-none' : ''}`}
          style={{ flexBasis: `${leftWidth}%` }}
        >
          {leftContent}
        </div>
        {/* Resizer */}
        <div
          ref={resizerRef}
          onMouseDown={handleMouseDown}
          className="resizer hidden md:block bg-[#ccc] hover:bg-blue-500 hover:transition-all hover:ease-in-out hover:duration-300 rounded-sm z-10"
          style={{
            width: "5px",
            height: '100%',
            cursor: "col-resize",
            position: "absolute",
            top: 0,
            left: `calc(${leftWidth}% - 2.5px)`,
            transform: "translateX(0)",
            zIndex: 20,
          }}
        ></div>

        {/* Right Content */}
        <div 
          ref={rightRef} 
          className={`h-[50%] md:h-full flex-1 min-w-[150px] transition-all duration-100 ${isResizing ? 'pointer-events-none' : ''}`}
          style={{ flexBasis: `${100 - leftWidth}%` }}
        >
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
