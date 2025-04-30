import React, { useState, useRef, useEffect, lazy, Suspense } from "react";
import { Editor } from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { useSettings } from "../../Context/SettingsContext";

const ResizableSplit = lazy(() => import("../Resizer/Resize"));

const files = {
  "script.js": {
    name: "script.js",
    language: "javascript",
    value: `function greet(name) {
	console.log("Hello, " + name + "!");
}
greet("hiren")`,
  },
  "style.css": {
    name: "style.css",
    language: "css",
    value: `
    *{
    margin:0;
    padding:0;
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
    }
    `,
  },
  "index.html": {
    name: "index.html",
    language: "html",
    value: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>HTML 5 Boilerplate</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
   <div></div>
  </body>
</html>
`,
  },
};

const Webeditor = () => {
  const { showCursors } = useSettings();
  const [fileName, setFileName] = useState("index.html");
  const { roomid } = useParams();
  console.log(roomid)
  const [fileContent, setFileContent] = useState(files[fileName].value);
  const [iframeContent, setIframeContent] = useState("");
  const previewTabRef = useRef(null);
  const urlRef = useRef(null);

  const content = `
  <html>
    <head>
      <style>${files["style.css"].value}</style>
    </head>
    <body>${files["index.html"].value}</body>
    <script>${files["script.js"].value}</script>
  </html>
`;

  const Runcode = () => {
    setIframeContent(content);
  };

  const OpenInBrowser = () => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
    }

    const blob = new Blob([content], { type: "text/html" });
    urlRef.current = URL.createObjectURL(blob);

    if (!previewTabRef.current || previewTabRef.current.closed) {
      previewTabRef.current = window.open(urlRef.current, "preview_tab");
    } else {
      previewTabRef.current.location.href = urlRef.current; // Refresh the opened tab
    }
  };

  // Auto-refresh only if the preview tab is already open
  useEffect(() => {
    Runcode();
    if (previewTabRef.current && !previewTabRef.current.closed) {
      OpenInBrowser();
    }
  }, [content]); // Only update when content changes

  const handleFileChange = (file) => {
    setFileName(file);
    setFileContent(files[file].value);
  };

  const handleCodeChange = (newCode) => {
    setFileContent(newCode);
    files[fileName].value = newCode;
  };
  return (
    <Suspense fallback={<div></div>}>
      <div>
        {/* Resizer */}
        <ResizableSplit
         roomid={roomid}
          leftContent={
            <div className="w-full h-full rounded-[.8rem] overflow-hidden border border-gray-700">
              <div className="flex bg-gray-800 text-white text-sm border-b  border-gray-700">
                {Object.keys(files).map((file) => (
                  <button
                    key={file}
                    className={`px-4 py-2 border-b-2 ${
                      fileName === file
                        ? "border-blue-500 text-blue-500"
                        : "border-transparent hover:text-gray-500"
                    }`}
                    onClick={() => handleFileChange(file)}
                  >
                    {file}
                  </button>
                ))}
              </div>
              <Editor
                height="calc(100% - 40px)"
                theme="vs-dark"
                value={fileContent}
                language={files[fileName].language}
                onChange={handleCodeChange}
              />
            </div>
          }
          rightContent={
            <div className="flex flex-col rounded-[.8rem] rounded-r-md bg-slate-100 h-full w-full">
              <button
                onClick={OpenInBrowser}
                className="bg-blue-500 text-white mx-1 my-1 py-2 px-4 rounded m-4 hover:bg-blue-600 self-start"
              >
                Opne In Browser
              </button>
              <iframe
                title="Live Preview"
                srcDoc={iframeContent}
                className=" w-full h-full border-none"
              />
            </div>
          }
          showCursors={showCursors} 
        />
      </div>
    </Suspense>
  );
};

export default Webeditor;
