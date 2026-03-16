import { invoke } from "@tauri-apps/api/core";
import { AiScript, NewAiScript } from "../common";

export async function get_ai_scripts() {
    const scripts = await invoke("ai_scripts_cmd") as AiScript[];
    return scripts
}

export async function remove_ai_script(id: number) {
    const r = await invoke('remove_ai_script_cmd', {scriptId: id})
    return r
}

export async function add_ai_script(new_script: NewAiScript) {
    const r = await invoke('add_ai_script_cmd', {newScript: new_script})
    return r
}
