"use client";
import { executeCode } from "../../Const/api.js";
import { Box, Text, Button, useToast } from "@chakra-ui/react";
import React, { useState } from "react";

const Output = ({ editorRef, language }) => {
  const toast = useToast();
  const [output, setoutput] = useState(null);
  const [isloading, setisloading] = useState(false);
  const [err, seterr] = useState(false);

  const runcode = async () => {
    const sourcecode = editorRef.current.getValue();
    if (!sourcecode) return;

    try {
      setisloading(true);
      const { run: result } = await executeCode(language, sourcecode);
      setoutput(result.output.split("\n"));
      result.stderr ? seterr(true) : seterr(false);
      // console.log(result.output);
    } catch (error) {
      toast({
        title: "An Error",
        description: error.message || "unable to run code",
        status: "error",
      });
    } finally {
      setisloading(false);
    }
  };

  return (
    <Box
      className="h-full w-full p-2 "
      border="1px solid"
      borderRadius={".8rem"}
      borderColor={err ? "red.500" : "gray.700"}
      background={"#1e1e1e"}
      position={"relative"}
    >
      <Box className="flex flex-col">
        <Text className="ml-2" textColor="white" fontSize={"lg"}>
          output
        </Text>
        <Button
        className="w-fit"
          isLoading={isloading}
          variant="outline"
          colorScheme="green"
          onClick={runcode}
        >
          Run Code
        </Button>
      </Box>

      <Box
        height="90%"
        overflowY="auto"
        textColor={err ? "red.500" : "white"}
        mt={2}
      >
        {output &&
          output.map((item, i) => (
            <Text textColor={!err ? "white" : "red"} key={i}>
              {item}
            </Text>
          ))}
      </Box>
    </Box>
  );
};
export default Output;
