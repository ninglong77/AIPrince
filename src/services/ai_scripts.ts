import { invoke } from "@tauri-apps/api/core";
import { AiScript } from "../common";

export async function get_ai_scripts() {
    const scripts = await invoke("ai_scripts_cmd") as AiScript[];
    return scripts
}
