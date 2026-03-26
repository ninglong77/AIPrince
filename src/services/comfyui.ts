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
