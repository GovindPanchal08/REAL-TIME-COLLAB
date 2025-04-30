import React, { useState, Suspense, lazy } from "react";
import { userData } from "../Context/context";
import { useNavigate } from "react-router-dom";
const Client = lazy(() => import("./SideBar/Client"));
const Chatbot = lazy(() => import("./Chat/ChatBot"));
const ChitChat = lazy(() => import("./Chat/ChitChat"));
const Setting = lazy(() => import("./SideBar/Setting"));
import { useSettings } from "../Context/SettingsContext";
import groupIcon from "../assets/group.png";
import chatIcon from "../assets/chat (1).png";
import chatbotIcon from "../assets/chatbot.png";
import settingsIcon from "../assets/settings (1).png";
import code from "../assets/code.png";
import defaultProfile from "../assets/public/images/profile.png";
import prompt from "../assets/prompt (1).png";

const LeftBar = () => {
  const { pic } = userData();
  const {
    handleIsWeb,
    isWeb,
    handleGenerateCode,
    generateCode,
    setisOpen,
    isOpen,
  } = useSettings();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(null);

  const handleUser = () => {
    navigate("/user");
  };

  const tabs = [
    {
      id: "participants",
      icon: groupIcon,
      tooltip: "Participants",
      component: <Client />,
    },
    {
      id: "chat",
      icon: chatIcon,
      tooltip: "Chat",
      component: <ChitChat />,
    },
    {
      id: "chatbot",
      icon: chatbotIcon,
      tooltip: "Chatbot",
      component: <Chatbot />,
    },
    {
      id: "settings",
      icon: settingsIcon,
      tooltip: "Settings",
      component: <Setting />,
    },
  ];

  const toggleTab = (tabId) => {
    setActiveTab(activeTab === tabId ? null : tabId);
  };
  // bg-[#2c2f3f]
  return (
    <div className="font-sans flex w-fit h-full ">
      {/* Sidebar */}
      <Suspense fallback={<div>...</div>}>
        <div
          className={`flex flex-col ${
            !activeTab && "rounded-[.8rem]"
          }  text-[#f5f5f5]  bg-[#2c2f3f]  border border-gray-700  transition-all duration-300 h-full shadow-lg`}
        >
          {/* User Profile Section */}

          <div className="w-full flex items-center justify-center mb-4 p-2 border-b border-gray-600">
            <div
              onClick={handleUser}
              className="w-12 h-12 cursor-pointer rounded-full overflow-hidden border-2 border-gray-500"
            >
              <img
                className="object-cover object-top w-full h-full"
                src={pic ? `data:image/jpeg;base64,${pic}` : defaultProfile}
                alt="Profile"
                loading="lazy"
              />
            </div>
          </div>
          {/* Navigation Tabs */}
          <div className="flex flex-col gap-4">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={` relative flex items-center justify-center p-3 rounded-md cursor-pointer hover:bg-[#3a3f58] transition-all  duration-300 ${
                  activeTab === tab.id ? "bg-[#555a75]" : ""
                }`}
                onClick={() => {
                  toggleTab(tab.id);
                  setisOpen(activeTab !== tab.id ? true : !isOpen);
                }}
              >
                <div className="relative group">
                  <img
                    className="w-8 h-8 group-hover:opacity-100"
                    src={tab.icon}
                    alt={tab.id}
                    loading="lazy"
                  />
                  <span className="absolute left-8 text-base top-0 z-10 transform -translate-y-1/2 bg-gray-800 text-white rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-all duration-75 pointer-events-none">
                    {tab.tooltip}
                  </span>
                </div>
              </div>
            ))}
            <div
              className={`flex items-center justify-center p-3 rounded-md cursor-pointer hover:bg-[#3a3f58] transition-all duration-300 `}
              onClick={() => handleIsWeb(!isWeb)}
            >
              <div className="relative group">
                <img className="w-8 h-8" src={code} alt="code" loading="lazy" />
              </div>
            </div>
            <div
              className={`flex items-center justify-center p-3 rounded-md cursor-pointer hover:bg-[#3a3f58] transition-all duration-300 `}
              onClick={() => handleGenerateCode(!generateCode)}
            >
              <div className="relative group">
                <img className="w-10 h-10" src={prompt} alt="" loading="lazy" />
                <span className="absolute  whitespace-nowrap break-keep left-8 text-base  top-0 z-10 transform -translate-y-[2rem] bg-gray-800 text-white rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-all duration-75 pointer-events-none">
                  Generate Code
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side Panels */}
        <div
          className={`${
            activeTab ? "p-2 w-[18rem]" : ""
          } bg-[#2c2f3f] text-white  ease-in transition-all duration-500`}
        >
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`ease-in transition-all duration-500 ${
                activeTab === tab.id
                  ? "block opacity-100 visible "
                  : "hidden opacity-0 invisible "
              }`}
            >
              {tab.component}
            </div>
          ))}
        </div>
      </Suspense>
    </div>
  );
};
export default LeftBar;
