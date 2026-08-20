-- Your SQL goes here

-- create kv store table
CREATE TABLE assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    local_path TEXT NOT NULL UNIQUE,
    comfyui_name TEXT NOT NULL,
    uploaded BOOLEAN NOT NULL DEFAULT 0,
    tags TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- 创建触发器，自动更新 updated_at（仅当未手动修改时）
CREATE TRIGGER update_assets_updated_at 
AFTER UPDATE ON assets
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE assets SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
