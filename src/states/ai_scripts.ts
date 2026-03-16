import { AiScript } from "../common";
import { create } from "zustand";
import { get_ai_scripts } from "../services/ai_scripts";

export interface AiScriptsStore {
  ai_scripts: AiScript[];
  findById: (id: number) => undefined | AiScript;
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
}));
