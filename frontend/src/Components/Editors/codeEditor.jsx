import React, { useRef, useState, useEffect, useCallback } from "react";
import * as monaco from "monaco-editor";
import _ from "lodash";
import { Editor } from "@monaco-editor/react";
import { Box } from "@chakra-ui/react";
import { CODE_SNIPPETS, getUserColor } from "../../Const/contant.js";
import Output from "./Output";
import Webeditor from "../Editors/WebEditor";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket, userData } from "../../Context/context.jsx";
import { fetchData, SendData } from "../../Const/api.js";
import ResizableSplit from "../Resizer/Resize.jsx";
import { useSettings } from "../../Context/SettingsContext.jsx";
const CodeEditor = () => {
  const userId = window.localStorage.getItem("userId");
  const {
    showCursors,
    theme,
    language,
    isWeb,
    handleCodeAndFile,
    generateCode,
    setgenerateCode,
  } = useSettings();
  const { socket, socketId } = useSocket();
  const { userName } = userData();
  const navigate = useNavigate();
  const { roomid } = useParams();
  const [value, setvalue] = useState(CODE_SNIPPETS[language] || "");
  const editorRef = useRef();
  const containerRef = useRef(null); // Ref for the whole container
  const [promptInput, setPromptInput] = useState(""); // Store user input
  const [loading, setLoading] = useState(false);

  const addDynamicCSS = (userId, userName) => {
    if (document.getElementById(`username-style-${userId}`)) return;
    const color = getUserColor(userId);
    const style = document.createElement("style");
    style.id = `username-style-${userId}`;
    style.innerHTML = `
      .username-label-${userId}::before {
        content: '${userName}'; /* Add the username dynamically */
        position: absolute;
        background-color: ${color}; /* Unique background color for this user */
        color: white; /* White text */
        padding: 7px;
        border-radius: 6px;
        font-size: 15px;
        top: -30px; /* Position above the line */
        left: 5px; /* Adjust horizontal position */
        z-index: 10;
        white-space: nowrap;
      }
    `;
    document.head.appendChild(style); // Append the style to the head
  };

  useEffect(() => {
    handleCodeAndFile(value, language);

    const fetchCode = async () => {
      try {
        if (roomid) {
          const response = await fetchData(
            `/room/get-code/${roomid}/${language}`
          );
          const fetchedCode = response.data;
          setvalue(fetchedCode);
        }
      } catch (error) {
        console.error("Error fetching room data", error.message);
        setvalue(CODE_SNIPPETS[language]); // Fallback to default
      }
    };
    fetchCode();
  }, [language, roomid]); // Fetch only when room/language changes

  // Debounced function to save the code to MongoDB
  const saveCode = useRef(
    _.debounce(async (newCode) => {
      try {
        await SendData("/room/save-code", { roomid, language, code: newCode });
        handleCodeAndFile(newCode, language);
        // console.log("Code saved!");
      } catch (error) {
        console.error("Error saving code", error);
      }
    }, 5000)
  ).current;

  let TypingTimeouts = useRef({});

  useEffect(() => {
    if (!roomid) {
      navigate("/");
    }
    if (socket) {
      socket.emit("join-room", { roomid, userId });

      socket.on("receive-code", (code) => {
        setvalue(code);
      });
      const activeTypingDecorations = new Map(); // Track decorations for each user
      // Handle typing event
      socket.on("typing", ({ lineNumber, userName, userId }) => {
        if (userId !== socketId) {
          // Clear existing decorations for this user
          addDynamicCSS(userId, userName);
          if (activeTypingDecorations.has(userId)) {
            const previousDecorations = activeTypingDecorations.get(userId);
            editorRef.current.deltaDecorations(previousDecorations, []);
          }

          // Add new decorations for typing
          const decorations = editorRef.current.deltaDecorations(
            [],
            [
              {
                range: new monaco.Range(lineNumber, 1, lineNumber, 1),
                options: {
                  isWholeLine: true,
                  className: "remote-line-highlight", // Add a CSS class for highlighting
                  hoverMessage: { value: `${userName} is typing...` },
                  afterContentClassName: `username-label-${userId}`,
                },
              },
            ]
          );

          // Save the new decorations
          activeTypingDecorations.set(userId, decorations);

          // Set timeout to clear the highlight
          if (TypingTimeouts.current[userId]) {
            clearTimeout(TypingTimeouts.current[userId]); // Clear any existing timeout
          }
          TypingTimeouts.current[userId] = setTimeout(() => {
            if (activeTypingDecorations.has(userId)) {
              const decorationsToRemove = activeTypingDecorations.get(userId);
              editorRef.current.deltaDecorations(decorationsToRemove, []); // Remove the decorations
              activeTypingDecorations.delete(userId); // Remove from the map
            }
          }, 1000); // Adjust timeout duration as needed
        }
      });

      socket.on("stop-typing", ({ socketId }) => {
        clearTimeout(TypingTimeouts.current[socketId]);
        editorRef.current.deltaDecorations([], []); // Clear decorations
      });

      return () => {
        socket.off("receive-code");
        socket.off("user-joined");
        socket.off("join-room");
        socket.off("typing");
        socket.off("stop-typing");
        activeTypingDecorations.forEach((decorations) => {
          editorRef.current.deltaDecorations(decorations, []);
        });
        activeTypingDecorations.clear();
        Object.values(TypingTimeouts.current).forEach(clearTimeout);
      };
    }
  }, [socket, roomid, userId, navigate, language,socketId]); // Ensure

  const onMount = useCallback(
    (editor) => {
      editorRef.current = editor;

      // Listen for cursor position changes
      editor.onDidChangeCursorPosition((event) => {
        const position = event.position;
        const lineNumber = position.lineNumber;

        // Emit the typing event to the server
        if (socket) {
          socket.emit("typing", {
            roomid,
            lineNumber,
            userName,
            socketId,
          });
        }

        // Clear local highlight when the user stops typing
        if (TypingTimeouts.current[socketId]) {
          clearTimeout(TypingTimeouts.current[socketId]);
        }
        TypingTimeouts.current[socketId] = setTimeout(() => {
          if (socket) socket.emit("stop-typing", { roomid, socketId });
        }, 1000);
      });

      editor.focus();
    },
    [socket, socketId]
  );

  //generating code with promptInput
  const handleGenerate = async () => {
    if (!promptInput.trim()) return;
    setLoading(true);
    try {
      const res = await SendData("/ai/generate-code", { prompt: promptInput });
      // console.log(res);
      if (res) {
        setvalue((prev) => prev + res.code);
      } else {
        alert("Error: " + res.error);
      }
    } catch (error) {
      console.error("Error generating code", error);
    }
    setLoading(false);
    setgenerateCode(false);
  };

  return (
    <Box
      ref={containerRef}
      display={"flex"}
      flexDirection={"column"}
      className="w-[100vh] " // Ensure it takes full screen height
    >
      {generateCode && (
        <div className="absolute top-2 ml-1 text-white bg-black px-4 py-3 z-10 rounded-lg">
          <p>What do you want to generate?</p>
          <input
            type="text"
            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white mt-2"
            placeholder="Generate a React form..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition w-full"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      )}
      {!isWeb ? (
        <div>
          <ResizableSplit
            roomid={roomid}
            leftContent={
              <div className="w-full h-full  rounded-[.8rem] overflow-hidden border border-gray-700">
                <Editor
                  key={language}
                  id="editor"
                  className="p-[1px] z-0"
                  value={value}
                  theme={theme}
                  language={language}
                  onChange={(newValue) => {
                    setvalue(newValue);
                    if (socket) socket.emit("code-change", newValue);
                    saveCode(newValue);
                  }}
                  onMount={(editor) => onMount(editor)}
                />
              </div>
            }
            rightContent={<Output editorRef={editorRef} language={language} />}
            showCursors={showCursors}
          />
        </div>
      ) : (
        <Webeditor />
      )}
    </Box>
  );
};

export default CodeEditor;
