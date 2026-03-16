use crate::ai_scripts::models::AiScript;



// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
pub fn ai_scripts_cmd() -> Vec<AiScript> {
    let scripts = crate::ai_scripts::service::list_ai_scripts();
    scripts
}

#[tauri::command]
pub fn remove_ai_script_cmd(script_id: i32) -> bool {
    crate::ai_scripts::service::remove_ai_script(script_id)
}
