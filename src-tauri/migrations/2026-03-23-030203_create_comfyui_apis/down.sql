-- This file should undo anything in `up.sql`

-- 删除触发器（如果存在）
DROP TRIGGER IF EXISTS update_comfyui_apis_updated_at;

-- 删除表（如果存在）
DROP TABLE IF EXISTS comfyui_apis;
