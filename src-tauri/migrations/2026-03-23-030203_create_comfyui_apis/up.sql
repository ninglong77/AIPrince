-- Your SQL goes here

CREATE TABLE IF NOT EXISTS comfyui_apis (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name TEXT NOT NULL UNIQUE,
    server_url TEXT  NOT NULL,
    prompt_api TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- 创建触发器，自动更新 updated_at（仅当未手动修改时）
CREATE TRIGGER update_comfyui_apis_updated_at 
AFTER UPDATE ON comfyui_apis
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE comfyui_apis SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
