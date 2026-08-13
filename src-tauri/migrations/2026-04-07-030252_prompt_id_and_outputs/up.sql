-- Your SQL goes here

-- create kv store table
CREATE TABLE kv_store (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);



-- 创建触发器，自动更新 updated_at（仅当未手动修改时）
CREATE TRIGGER update_kv_store_updated_at 
AFTER UPDATE ON kv_store
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE kv_store SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
