import axios from "axios";
import { LANGUAGE_VERSIONS } from "./contant.js";
const baseurl = import.meta.env.VITE_BACKEND_URL;
export const fetchData = async (endpoint, options = {}) => {
  const url = `${baseurl}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result;
};

export const SendData = async (endpoint, data, config = {}) => {
  const url = `${baseurl}${endpoint}`;

  const fetchOptions = {
    method: "POST",
    credentials: "include",
    ...config,
  };

  // Check if data is an instance of FormData
  if (data instanceof FormData) {
    fetchOptions.body = data;
  } else {
    fetchOptions.headers = {
      "Content-Type": "application/json",
      ...config.headers,
    };
    fetchOptions.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error :", error.message);
  }
};

export const getCsrfToken = async () => {
  const response = await fetch("http://localhost:3001/api/csrf-token", {
    credentials: "include",
  });
  const data = await response.json();
  return data.csrfToken;
};

// for executing code
const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});
// const getAvailableLanguages = async () => {
//   const response = await API.get("/runtimes");
//   console.log(response.data);
// };
// getAvailableLanguages();

export const executeCode = async (language, sourcecode) => {
  const response = await API.post("/execute", {
    language: language,
    version: LANGUAGE_VERSIONS[language],
    files: [
      {
        content: sourcecode,
      },
    ],
  });
  return response.data;
};
