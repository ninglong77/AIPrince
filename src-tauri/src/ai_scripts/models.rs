use diesel::prelude::*;
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

#[derive(Queryable, Selectable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::ai_scripts)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct AiScript {
    pub id: i32,
    pub uuid: String,
    pub name: String,
    pub content: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Insertable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::ai_scripts)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct NewAiScript {
    pub uuid: String,
    pub name: String,
    pub content: String,
}
