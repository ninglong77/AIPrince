use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Queryable, Selectable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::assets)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Assets {
    pub id: i32,
    pub local_path: String,
    pub comfyui_name: String,
    pub uploaded: bool,
    pub tags: Option<String>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Insertable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::assets)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct NewAsset {
    pub local_path: String,
    pub comfyui_name: String,
    pub tags: Option<String>,
    pub uploaded: bool,
}

// changeset
#[derive(AsChangeset, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::assets)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct AssetChangeset {
    pub comfyui_name: Option<String>,
    pub tags: Option<String>,
    pub uploaded: Option<bool>,
}


pub fn insert_asset(new_asset: NewAsset) -> bool {
    use crate::establish_connection;
    use crate::schema::assets::dsl::*;

    let conn = &mut establish_connection();

    diesel::insert_into(assets)
        .values(&new_asset)        
        .execute(conn)
        .is_ok()
}

pub fn update_asset(asset_id: i32, updated_asset: AssetChangeset) -> bool {
    use crate::establish_connection;
    use crate::schema::assets::dsl::*;

    let conn = &mut establish_connection();

    diesel::update(assets.filter(id.eq(asset_id)))
        .set(&updated_asset)
        .execute(conn)
        .is_ok()
}

pub fn get_assets(id1: i32) -> Option<Assets> {
    use crate::establish_connection;
    use crate::schema::assets::dsl::*;

    let conn = &mut establish_connection();

    assets.filter(id.eq(id1)).first::<Assets>(conn).ok()
}

pub fn list_assets() -> Vec<Assets> {
    use crate::establish_connection;
    use crate::schema::assets::dsl::*;

    let conn = &mut establish_connection();

    assets.order_by(created_at.desc()).load::<Assets>(conn).unwrap()
}

#[tauri::command]
pub fn get_assets_cmd(id: i32) -> Option<Assets> {
    get_assets(id)
}

#[tauri::command]
pub fn insert_assets_cmd(local_path: String, tags: String) -> bool {
    insert_asset(NewAsset {local_path: local_path, comfyui_name: "".to_string(), tags: Some(tags), uploaded: false })
}

#[tauri::command]
pub fn list_assets_cmd() -> Vec<Assets> {
    list_assets()
}

#[tauri::command]
pub fn update_local_asset_cmd(id: i32, updated: AssetChangeset) -> bool {
    update_asset(id, updated)
}
