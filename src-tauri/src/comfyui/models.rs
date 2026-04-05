use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Queryable, Selectable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::comfyui_apis)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct ComfyUiApi {
    pub id: i32,
    pub name: String,
    pub server_url: String,
    pub prompt_api: String,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: chrono::NaiveDateTime,
    pub alias: String,
}

#[derive(Insertable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::comfyui_apis)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct NewComfyUiApi {
    pub name: String,
    pub server_url: String,
    pub prompt_api: String,
    pub alias: String,
}
