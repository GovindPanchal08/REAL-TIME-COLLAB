import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { SocketProvider, UserProvider } from "../src/Context/context.jsx";
import { SettingsProvider } from "../src/Context/SettingsContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SocketProvider>
      <UserProvider>
        <SettingsProvider>
          <ChakraProvider>
            <App />
          </ChakraProvider>
        </SettingsProvider>
      </UserProvider>
    </SocketProvider>
  </StrictMode>
);
