-- Your SQL goes here

-- 创建表
CREATE TABLE ai_scripts (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    uuid TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO ai_scripts (uuid, name, content) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Alice Smith', 'This is the first random content entry.'),
('b1f1d2e3-4a5b-6c7d-8e9f-0a1b2c3d4e5f', 'Bob Johnson', 'Another random piece of text for the second record.'),
('c2d3e4f5-6a7b-8c9d-0e1f-2a3b4c5d6e7f', 'Charlie Brown', 'Some more content, maybe a bit longer, but still random and descriptive.'),
('d3e4f5a6-7b8c-9d0e-1f2a-3b4c5d6e7f8a', 'Diana Prince', 'Wonder Woman is a superheroine, but this is just a test with some extra text.'),
('e4f5a6b7-8c9d-0e1f-2a3b-4c5d6e7f8a9b', 'Ethan Hunt', 'Mission Impossible theme plays in the background.'),
('f5a6b7c8-9d0e-1f2a-3b4c-5d6e7f8a9b0c', 'Fiona Gallagher', 'Shameless TV show reference, but still random content.');

-- 创建触发器，自动更新 updated_at（仅当未手动修改时）
CREATE TRIGGER update_ai_scripts_updated_at 
AFTER UPDATE ON ai_scripts
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE ai_scripts SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
