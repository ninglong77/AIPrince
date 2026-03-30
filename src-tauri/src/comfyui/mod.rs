use std::{collections::HashMap, fs};
pub mod commands;
mod models;
mod service;

use reqwest::blocking::Client;
use serde::{Deserialize, Serialize};
use tauri::Url;
use tauri_plugin_log::log;
use uuid::Uuid;

use crate::StdResult;

#[derive(Serialize, Deserialize)]
pub struct ComfyUiPromptResult {
    prompt_id: String,
    number: i32,
}

fn get_server_url() -> String {
    let server =
        std::env::var("COMFYUI_SERVER").unwrap_or("http://192.168.31.99:18188".to_string());
    server
}

fn get_files_root() -> String {
    // get env var of create a folder named .prince_files in home directory
    let home = std::env::var("HOME").unwrap();
    let default_files_root = format!("{}/{}", home, ".prince_files");
    let files_root = std::env::var("PRIENCE_FILES_ROOT").unwrap_or(default_files_root);
    std::fs::create_dir_all(files_root.clone()).expect("Failed to create files root directory");
    files_root
}

pub fn queue_prompt(server: &String, prompt: &String) -> StdResult<ComfyUiPromptResult> {
    let url = format!("{}/prompt", server);
    let mut json_data = HashMap::new();
    // deserialize prompt to json
    let prompt_json: serde_json::Value = serde_json::from_str(prompt).unwrap();
    json_data.insert("prompt", prompt_json);

    let client = reqwest::blocking::Client::new();
    let response = client
        .post(url)
        .json(&json_data) // Automatically sets Content-Type: application/json
        .send()
        .expect("Failed to send POST request");
    let data: ComfyUiPromptResult = response.json()?;
    Ok(data)
}

pub fn get_history(server: &String, prompt_id: &String) -> StdResult<serde_json::Value> {
    let url = format!("{}/history/{}", server, prompt_id);
    let client = reqwest::blocking::Client::new();
    let response = client.get(url).send().expect("Failed to send GET request");
    if response.status() != reqwest::StatusCode::OK {
        println!("Error: {}", response.text().unwrap());
        return Err("error".into());
    }
    Ok(response.json().expect("Failed to parse JSON"))
}

#[tauri::command]
pub fn queue_prompt_cmd(prompt: String) -> Option<ComfyUiPromptResult> {
    match queue_prompt(&get_server_url(), &prompt) {
        Ok(result) => Some(result),
        Err(error) => {
            println!("Queue prompt Error: {}", error);
            None
        }
    }
}

#[tauri::command]
pub fn get_history_cmd(prompt_id: String) -> Option<serde_json::Value> {
    match get_history(&get_server_url(), &prompt_id) {
        Ok(result) => Some(result),
        Err(error) => {
            println!("Get history Error: {}", error);
            None
        }
    }
}

fn get_image_bytes(
    server: &str,
    filename: &str,
    subfolder: &str,
    folder_type: &str,
) -> Result<Vec<u8>, reqwest::Error> {
    let client = Client::new();

    let url = format!("{}/view", server);

    // 解析基础 URL
    let mut base = Url::parse(&url).unwrap();

    // 添加查询参数
    base.query_pairs_mut()
        .append_pair("filename", filename)
        .append_pair("subfolder", subfolder)
        .append_pair("type", folder_type);

    let response = client
        .get(base)
        // (&params)                      // 自动将 HashMap 转换为 URL 查询参数
        .send()?; // 发送请求

    let bytes = response.bytes()?; // 获取响应体字节
    Ok(bytes.to_vec()) // 转换为 Vec<u8>
}

fn get_and_save_image(
    server: &str,
    filename: &str,
    subfolder: &str,
    folder_type: &str,
) -> StdResult<String> {
    let bytes = get_image_bytes(server, filename, subfolder, folder_type)?;
    // generate filename with uuid
    let uuid = Uuid::new_v4();
    // get files root
    let files_root = get_files_root();
    let path = format!("{}/{}.png", files_root, uuid);
    fs::write(path.clone(), bytes)?;

    return Ok(path);
}

#[tauri::command]
pub fn get_and_save_image_cmd(
    server: String,
    filename: String,
    subfolder: String,
    folder_type: String,
) -> Option<String> {
    let subfolder = match subfolder.eq("--") {
        true => "",
        false => &subfolder,
    };
    match get_and_save_image(&server, &filename, subfolder, &folder_type) {
        Ok(path) => Some(path),
        Err(err) => {
            log::error!("Error getting image: {}", err);
            None
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_queue_prompt() {
        let server = String::from("http://192.168.31.99:8188");
        // read file as string(utf-8)
        // let file = "./image_z_image_turbo.json";
        // let prompt = std::fs::read_to_string(file).expect("Failed to read file");
        // // let prompt = String::from(include_str!("./image_z_image_turbo.json"));
        // let data = queue_prompt(&server, &prompt).expect("failed");
        // println!("{}", data.prompt_id);
        let prompt_id = String::from("cfd5e365-210d-457f-9616-7cdae26dbf3d");
        let data = get_history(&server, &prompt_id).expect("failed");
        println!("{}", data);
    }
}
