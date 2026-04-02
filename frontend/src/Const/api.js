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

// const API = axios.create({
//   baseURL: "https://judge0-extra-ce1.p.rapidapi.com",
//   headers: {
//     "Content-Type": "application/json",
//     "X-RapidAPI-Key": "ff9e198c5cmshe7020d20ff1bc5fp10bd86jsnaf5e80800ade",
//     "X-RapidAPI-Host": "judge0-extra-ce1.p.rapidapi.com",
//   },
// });

// export const executeCode = async (language_id, code, stdin = "") => {
//   try {
//     const response = await API.post(
//       "/submissions?base64_encoded=true&wait=true",
//       {
//         language_id,
//         source_code: btoa(code),
//         stdin: btoa(stdin),
//       },
//     );
//     console.log({
//       stdout: response.data.stdout ? atob(response.data.stdout) : "",
//       stderr: response.data.stderr ? atob(response.data.stderr) : "",
//       compile_output: response.data.compile_output
//         ? atob(response.data.compile_output)
//         : "",
//       status: response.data.status,
//     });

//     return {
//       stdout: response.data.stdout ? atob(response.data.stdout) : "",
//       stderr: response.data.stderr ? atob(response.data.stderr) : "",
//       compile_output: response.data.compile_output
//         ? atob(response.data.compile_output)
//         : "",
//       status: response.data.status,
//     };
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     throw err;
//   }
// };
const getFileName = (language) => {
  const map = {
    javascript: "index.js",
    python: "index.py",
    java: "Main.java",
    cpp: "main.cpp",
    c: "main.c",
    csharp: "Program.cs",
    php: "index.php",
    golang: "main.go",
    ruby: "main.rb",
  };

  return map[language] || "index.txt";
};

const API = axios.create({
  baseURL: "https://onecompiler-apis.p.rapidapi.com/api/v1",
  headers: {
    "Content-Type": "application/json",
    "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
    "X-RapidAPI-Host": "onecompiler-apis.p.rapidapi.com",
  },
});
export const executeCode = async (language, code, stdin = "") => {
  try {
    const response = await API.post("/run", {
      language,
      stdin,
      files: [
        {
          name: getFileName(language),
          content: code,
        },
      ],
    });
    return response?.data;
  } catch (err) {
    console.error(err.response?.data || err.message);
    throw err;
  }
};
