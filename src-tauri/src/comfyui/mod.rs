use std::collections::HashMap;

use serde::{Deserialize, Serialize};

use crate::StdResult;

#[derive(Serialize, Deserialize)]
pub struct ComfyUiPromptResult {
    prompt_id: String,
    number: i32,
}

fn get_server_url() -> String {
    let server = std::env::var("COMFYUI_SERVER").unwrap_or("http://192.168.31.99:8188".to_string());
    server
}

pub fn queue_prompt(server: &String, prompt: &String) ->StdResult<ComfyUiPromptResult> {
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
    let response = client
        .get(url)
        .send()
        .expect("Failed to send GET request");
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


