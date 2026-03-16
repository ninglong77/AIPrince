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
