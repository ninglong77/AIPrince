use crate::comfyui::models;
use diesel::{query_dsl::methods::OrderDsl, ExpressionMethods, RunQueryDsl};

pub fn list_comfyui_apis() -> Vec<models::ComfyUiApi> {
    use crate::schema::comfyui_apis::dsl::*;
    let connection = &mut crate::establish_connection();
    comfyui_apis
        .order(created_at.desc())
        .load::<models::ComfyUiApi>(connection)
        .expect("Error loading AI scripts")
}


pub fn remove_comfyui_apis(script_id: i32) -> bool {
    use crate::schema::comfyui_apis::dsl::*;
    use diesel::QueryDsl;
    let connection = &mut crate::establish_connection();
    diesel::delete(comfyui_apis.filter(id.eq(script_id)))
        .execute(connection)
        .is_ok()
}

pub fn add_comfyui_apis(new_script: models::NewComfyUiApi) -> bool {
    use crate::schema::comfyui_apis::dsl::*;
    let connection = &mut crate::establish_connection();
    diesel::insert_into(comfyui_apis)
        .values(&new_script)
        .execute(connection)
        .is_ok()
}

pub fn update_comfyui_apis(script_id: i32, updated_script: models::NewComfyUiApi) -> bool {
    use crate::schema::comfyui_apis::dsl::*;
    use diesel::QueryDsl;
    let connection = &mut crate::establish_connection();
    diesel::update(comfyui_apis.filter(id.eq(script_id)))
        .set((
            server_url.eq(updated_script.server_url),
            name.eq(updated_script.name),
            prompt_api.eq(updated_script.prompt_api),
        ))
        .execute(connection)
        .is_ok()
}
