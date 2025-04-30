import React, { createContext, useContext, useState, useEffect } from "react";

// Create Context
const SettingsContext = createContext();

// Context Provider
export const SettingsProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem("selectedLanguage") || "javascript"
  );
  const [theme, setTheme] = useState("vs-dark");
  const [showCursors, setShowCursors] = useState(
    localStorage.getItem("showCursors") === "true" ? true : false
  );
  const [isOpen, setisOpen] = useState(false);
  const [isWeb, setIsWeb] = useState(false);
  const [codedata, setcodedata] = useState({
    code: "",
    fileName: "code",
  });
  const [generateCode, setgenerateCode] = useState(false);
  const [isLogin, setisLogin] = useState(false);
  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Update Theme
  const handleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("selectedTheme", newTheme);
  };

  // Update Language
  const handleLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem("selectedLanguage", newLanguage);
  };

  // Toggle Cursor Visibility
  const toggleCursors = () => {
    setShowCursors((prev) => !prev);
    localStorage.setItem("showCursors", !showCursors);
  };

  //  toggle for web or code editor
  const handleIsWeb = () => {
    setIsWeb(!isWeb);
  };
  const handleCodeAndFile = (code, file) => {
    setcodedata({ code: code, fileName: file });
  };
  const handleGenerateCode = () => {
    setgenerateCode(!generateCode);
  };

  return (
    <SettingsContext.Provider
      value={{
        language,
        theme,
        showCursors,
        isWeb,
        codedata,
        generateCode,
        isLogin,
        isOpen,
        setisOpen,
        setisLogin,
        setgenerateCode,
        handleTheme,
        handleLanguage,
        toggleCursors,
        handleIsWeb,
        handleCodeAndFile,
        handleGenerateCode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// Custom Hook to use SettingsContext
export const useSettings = () => useContext(SettingsContext);
