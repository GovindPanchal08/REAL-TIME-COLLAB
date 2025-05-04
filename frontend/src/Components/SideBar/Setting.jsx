import React, { Suspense, lazy } from "react";

const LanguageSelect = lazy(() => import("../Editors/LanguageSelect"));
const Theme = lazy(() => import("../Editors/Theme"));
import { useSettings } from "../../Context/SettingsContext";
import { Box, Switch, Text } from "@chakra-ui/react";
import { SendData } from "../../Const/api.js";
import { toast } from "react-toastify";

const Setting = () => {
  const { showCursors, toggleCursors, codedata } = useSettings();

  const handleDownloadCode = (filename = "code.js") => {
    const blob = new Blob([codedata.code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const openInvsCode = async () => {
    const { fileName, code } = codedata;
    console.log(fileName);
    const res = await SendData("/save-open-vscode", {
      fileName,
      code,
    });
    if (res.message) toast.success("File saved and opened in VS Code");
    // console.log(res.message);
  };
  return (
    <>
      <Suspense fallback={<div></div>}>
        <Box mt={2}>
          <div className="mt-2">
            <h5 className="text-2xl font-medium tracking-tight">Setting</h5>
            <div className="h-[.5px] bg-gray-300 opacity-25 my-[1.04rem]"></div>
          </div>
          <Box mb={4}>
            <LanguageSelect />
          </Box>
          <Box mb={7}>
            <Theme />
          </Box>
          <Box display="flex" alignItems="center" gap={3}>
            <Text fontSize="lg" fontWeight="400">
              Show Cursors:
            </Text>
            <Switch
              colorScheme="blue"
              isChecked={showCursors}
              onChange={toggleCursors}
            />
          </Box>
          <div className="mt-6">
            <div className="flex gap-3">
              <button
                onClick={handleDownloadCode}
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
              >
                Download Code
              </button>
              <button
                onClick={openInvsCode}
                className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-300"
              >
                Open With vsCode
              </button>
            </div>
          </div>
        </Box>
      </Suspense>
    </>
  );
};

export default Setting;
