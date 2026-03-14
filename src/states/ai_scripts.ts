import { atom } from "recoil";
import { AiScript } from "../common";

export const aiScriptFormdataState = atom({
  key: "aiScriptFormdata",
  default: { name: "", content: "" },
});

export const aiScriptsState = atom<AiScript[]>({
  key: "aiScripts",
  default: [
    {
      id: "1",
      name: "Hello World",
      content: 'print("Hello, world!")\n// 第一个脚本示例',
    },
    {
      id: "2",
      name: "Fibonacci",
      content:
        "function fib(n) {\n  if (n <= 1) return n;\n  return fib(n-1) + fib(n-2);\n}",
    },
    {
      id: "3",
      name: "数组映射",
      content: "const doubled = [1, 2, 3].map(x => x * 2);",
    },
    {
      id: "4",
      name: "递归示例",
      content:
        "function factorial(n) {\n  if (n === 0) return 1;\n  return n * factorial(n-1);\n}",
    },
    {
      id: "5",
      name: "Promise 示例",
      content:
        'new Promise((resolve) => {\n  setTimeout(() => resolve("done"), 1000);\n}).then(console.log);',
    },
    {
      id: "6",
      name: "数组过滤",
      content: "[1, 2, 3, 4, 5].filter(x => x % 2 === 0);",
    },
  ],
});
