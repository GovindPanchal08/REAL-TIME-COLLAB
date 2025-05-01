export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2",
  csharp: "6.12.0",
  php: "8.2.3",
  cpp: "10.2.0",
  c: "10.2.0",
  golang: "1.16.2",
  ruby: "3.0.1",
};

export const CODE_SNIPPETS = {
  javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
  typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
  python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
  java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
  csharp:
    'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
  php: `<?php\n\n$name = 'Alex';\necho $name;\n`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n\tcout << "Hello, Alex!" << endl;\n\treturn 0;\n}\n`,
  c: `#include <stdio.h>\n\nint main() {\n\tprintf("Hello, Alex!\\n");\n\treturn 0;\n}\n`,
  golang: `package main\n\nimport "fmt"\n\nfunc main() {\n\tname := "Alex"\n\tfmt.Println("Hello, " + name + "!")\n}\n`,
  ruby: `def greet(name)\n\tputs "Hello, #{name}!"\nend\n\ngreet("Alex")\n`,
};
export const features = [
  {
    img: "/image1.png",
    title: "Chat",
    desc: "Real-time messaging for seamless collaboration.",
  },
  {
    img: "/image5.png",
    title: "Chatbot",
    desc: "AI-powered chatbot for instant assistance.",
  },
  {
    img: "/image2.png",
    title: "Group Video Call",
    desc: "Collaborate face-to-face with team members.",
  },
  {
    img: "/image1.png",
    title: "Multiple Programming Languages",
    desc: "Code in various programming languages.",
  },
  {
    img: "/image3.png",
    title: "Code & Web Editor",
    desc: "Live code and web development environment.",
  },
];

export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}
export const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
const userColors = {};
export const getUserColor = (id) => {
  if (!userColors[id]) {
    userColors[id] = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }
  return userColors[id];
};
