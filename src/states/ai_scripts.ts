import { AiScript } from "../common";
import { create } from "zustand";
import { v4 } from "uuid";
import { get_ai_scripts } from "../services/ai_scripts";

interface ScriptObj {
  name: string;
  content: string;
}

export interface AiScriptsStore {
  ai_scripts: AiScript[];
  add: (item: ScriptObj) => void;
  findById: (id: string) => undefined | AiScript;
  eidt: (id: string, item: ScriptObj) => void;
  remove: (id: string) => void;
  refresh: () => Promise<void>;
}

export const useAiScriptsStore = create<AiScriptsStore>((set, ai_scripts) => ({
  ai_scripts: [],
  refresh: async () => {
    const ai_scripts = await get_ai_scripts();
    set(() => {
      return {
        ai_scripts,
      };
    });
  },
  findById: (id) => ai_scripts().ai_scripts.filter((m) => m.id === id)[0],
  eidt: (id, obj) =>
    set((state) => {
      return {
        ai_scripts: state.ai_scripts.map((i) => {
          if (i.id === id) {
            return { id, ...obj };
          }
          return i;
        }),
      };
    }),
  remove: (id) =>
    set((state) => {
      return {
        ai_scripts: state.ai_scripts.filter((i) => i.id !== id),
      };
    }),
  add: (ai_script) =>
    set((state) => {
      let max_id = v4();
      return {
        ai_scripts: [{ ...ai_script, id: max_id }, ...state.ai_scripts],
      };
    }),
}));
