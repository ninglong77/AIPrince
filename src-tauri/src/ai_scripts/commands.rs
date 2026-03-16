use crate::ai_scripts::models::AiScript;



// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
pub fn ai_scripts_cmd() -> Vec<AiScript> {
    let scripts = crate::ai_scripts::service::list_ai_scripts();
    scripts
}
