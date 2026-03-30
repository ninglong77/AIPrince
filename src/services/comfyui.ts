import { invoke } from "@tauri-apps/api/core";
import { ComfyUiApi, NewComfyUiApi } from "../common";

export async function get_comfyui_apis() {
    const scripts = await invoke("comfyui_apis_cmd") as ComfyUiApi[];
    return scripts
}

export async function remove_comfyui_api(id: number) {
    const r = await invoke('remove_comfyui_api_cmd', {scriptId: id})
    return r
}

export async function add_comfyui_api(new_script: NewComfyUiApi) {
    const r = await invoke('add_comfyui_api_cmd', {newScript: new_script})
    return r
}

export async function update_comfyui_api(id: number, script: NewComfyUiApi) {
    const r = await invoke('update_comfyui_api_cmd', {scriptId: id, updatedScript: script})
    return r
}


export interface ComfyUiResult {
  prompt_id: string;
  number: number;
}

export async function queue_prompt_cmd(prompt: string): Promise<ComfyUiResult> {
  const r: ComfyUiResult = await invoke('queue_prompt_cmd', {prompt: prompt})
  return r
}

export async function get_history_cmd(prompt_id: string) {
  const r = await invoke('get_history_cmd', {promptId: prompt_id})
  return r
}

export async function get_and_save_image_cmd(server: string, filename: string, subfolder: string, folder_type: string) {
  const r = await invoke('get_and_save_image_cmd', {
    server: server,
    filename: filename,
    subfolder: !subfolder ? "--" : subfolder,
    folderType: folder_type
  })
  return r as any as string
}
