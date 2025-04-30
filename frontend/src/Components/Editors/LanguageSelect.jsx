import React from "react";
import { Box, Select, Text } from "@chakra-ui/react";
import { LANGUAGE_VERSIONS } from "../../Const/contant.js";
import { useSettings } from "../../Context/SettingsContext.jsx";

const lang = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelect = () => {
  const { language, handleLanguage } = useSettings();
  return (
    <Box id="lang" alignItems="center" gap={2}>
      <Text fontSize="large" fontWeight={400} textColor="white">
        Language
      </Text>
      <Select
        bg="#f5f5f5"
        color="black"
        border="1px solid #ccc"
        value={language}
        onChange={(e) => handleLanguage(e.target.value)}
        _hover={{ borderColor: "blue.400" }}
        _focus={{ borderColor: "blue.400", boxShadow: "0 0 5px blue.400" }}
      >
        {lang.map(([key, version]) => (
          <option
            key={key}
            value={key}
            style={{ background: "#f5f5f5", color: "black" }}
          >
            {key} - {version}
          </option>
        ))}
      </Select>
    </Box>
  );
};

export default LanguageSelect;
