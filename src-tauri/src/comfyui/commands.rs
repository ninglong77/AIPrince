use crate::comfyui::models::ComfyUiApi;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
pub fn comfyui_apis_cmd() -> Vec<ComfyUiApi> {
    let scripts = crate::comfyui::service::list_comfyui_apis();
    scripts
}

#[tauri::command]
pub fn remove_comfyui_api_cmd(script_id: i32) -> bool {
    crate::comfyui::service::remove_comfyui_apis(script_id)
}

#[tauri::command]
pub fn add_comfyui_api_cmd(new_script: crate::comfyui::models::NewComfyUiApi) -> bool {
    crate::comfyui::service::add_comfyui_apis(new_script)
}

#[tauri::command]
pub fn update_comfyui_api_cmd(
    script_id: i32,
    updated_script: crate::comfyui::models::NewComfyUiApi,
) -> bool {
    crate::comfyui::service::update_comfyui_apis(script_id, updated_script)
}
