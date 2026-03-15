import { AiScript } from "../common";
import { create } from "zustand";
import { v4 } from "uuid";

interface ScriptObj {
  name: string;
  content: string 
}

export interface AiScriptsStore {
  ai_scripts: AiScript[];
  add: (item: ScriptObj) => void;
  findById: (id: string) => undefined | AiScript;
  eidt: (id: string, item: ScriptObj) => void;
  remove: (id: string) => void;
}

export const useAiScriptsStore = create<AiScriptsStore>((set, ai_scripts) => ({
  ai_scripts: [
    {
      id: "1",
      name: "Hello World2",
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
  findById: (id) => ai_scripts().ai_scripts.filter(m => m.id === id)[0],
  eidt: (id, obj) => set((state) => {
    return {
      ai_scripts: state.ai_scripts.map(i => {
      if (i.id === id) {
        return {id, ...obj}
      }
      return i
    })
    }
  }),
  remove: (id) => set(state => {
    return {
      ai_scripts: state.ai_scripts.filter(i => i.id !== id)
    }
  }),
  add: (ai_script) =>
    set((state) => {
      let max_id = v4();
      return {
        ai_scripts: [{ ...ai_script, id: max_id }, ...state.ai_scripts],
      };
    }),
}));
