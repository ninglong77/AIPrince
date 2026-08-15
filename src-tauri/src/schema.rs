// @generated automatically by Diesel CLI.

diesel::table! {
    ai_scripts (id) {
        id -> Integer,
        uuid -> Text,
        name -> Text,
        content -> Text,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    comfyui_apis (id) {
        id -> Integer,
        name -> Text,
        server_url -> Text,
        prompt_api -> Text,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        alias -> Text,
    }
}

diesel::table! {
    kv_store (id) {
        id -> Integer,
        key -> Text,
        value -> Text,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::allow_tables_to_appear_in_same_query!(ai_scripts, comfyui_apis, kv_store,);
