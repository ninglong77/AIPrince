import { create } from "zustand";
import {
  ComfyUiResult,
  get_and_save_image_cmd,
  get_history_cmd,
  queue_prompt_cmd,
} from "../services/comfyui";

export interface ComfyUiNode {
  inputs: {
    [key: string]: any;
  };
  class_type: string;
  _meta?: {
    title: string;
  };
}

export interface ComfyUiHistory {
  status: {
    completed: boolean;
    messages: [][];
    status_str: string;
  };
  outputs: {
    [key: string]: {
      images?: {
        filename: string;
        sub_folder: string;
        type: string;
      }[];
    };
  }
}

export interface Node {
  id: string;
  node: ComfyUiNode;
}

export interface ComfyUiStore {
  parse_prompt: (prompt: string) => Node[];
  queue_prompt: (prompt: Node[]) => Promise<ComfyUiResult>;
  get_history: (prompt_id: string) => Promise<ComfyUiHistory>;
  wait_for_result: (prompt_id: string) => Promise<ComfyUiHistory>;
  get_image: (server: string, history: ComfyUiHistory) => Promise<string[]>;
}

export const useComfyUiStore = create<ComfyUiStore>(() => ({
  parse_prompt: (prompt: string) => {
    const json = JSON.parse(prompt);
    const arr: Node[] = [];
    for (const [key, value] of Object.entries(json)) {
      arr.push({
        id: key,
        node: value as ComfyUiNode,
      });
    }
    return arr;
  },
  get_history: async (prompt_id: string) => {
    const history: any = await get_history_cmd(prompt_id);
    const obj = history[prompt_id];
    if (!obj) {
      return {
        status: {
          completed: false,
          messages: [],
          status_str: 'queuing'
        },
      }
    }
    return obj
  },
  queue_prompt: async (prompt: Node[]): Promise<ComfyUiResult> => {
    const obj: any = {};
    for (const n of prompt) {
      obj[n.id] = n.node;
    }
    const result = await queue_prompt_cmd(JSON.stringify(obj));
    return result;
  },
  wait_for_result: async (prompt_id: string): Promise<ComfyUiHistory> => {
    while (true) {
      const history: any = await get_history_cmd(prompt_id);
      const obj = history[prompt_id] as ComfyUiHistory|undefined;
      if (obj && obj.status.completed) {
        return obj;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  },
  get_image: async (server: string, history: ComfyUiHistory): Promise<string[]> => {
    const arr = [];
    for (const node in history.outputs) {
      const output = history.outputs[node];
      if (output.images) {
        for (const image in output.images) {
          const obj = output.images[image];
          const img = await get_and_save_image_cmd(server, obj.filename, obj.sub_folder, obj.type);
          arr.push(img as any)
        }
      }
      
    }
    return arr
  }
}));
