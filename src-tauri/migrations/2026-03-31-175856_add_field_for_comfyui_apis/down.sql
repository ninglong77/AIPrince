-- This file should undo anything in `up.sql`

-- Remove alias field from comfyui_apis
ALTER TABLE comfyui_apis DROP COLUMN alias;
