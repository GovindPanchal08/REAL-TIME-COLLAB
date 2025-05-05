import React from "react";
import { Box, Select, Text } from "@chakra-ui/react";
import { useSettings } from "../../Context/SettingsContext.jsx";

const themes = [
  { id: "vs-dark", name: "Dark Theme" },
  { id: "vs", name: "Light Theme" },
  { id: "hc-black", name: "High Contrast" },
];

const Theme = () => {
  const { theme, handleTheme } = useSettings();

  return (
    <Box id="theme" alignItems="center" gap={2}>
      <Text fontSize="lg" fontWeight={400} textColor="white">
        Theme
      </Text>
      <Select
        bg="#f5f5f5"
        color="black"
        border="1px solid #ccc"
        value={theme}
        onChange={(e) => handleTheme(e.target.value)}
        _hover={{ borderColor: "blue.400" }}
        _focus={{ borderColor: "blue.400", boxShadow: "0 0 5px blue.400" }}
      >
        {themes.map(({ id, name }) => (
          <option
            key={id}
            value={id}
            style={{ background: "#ffffff", color: "black" }}
          >
            {name}
          </option>
        ))}
      </Select>
    </Box>
  );
};

export default Theme;
