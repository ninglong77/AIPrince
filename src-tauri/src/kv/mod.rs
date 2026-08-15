use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Queryable, Selectable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::kv_store)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct KvStore {
    pub id: i32,
    pub key: String,
    pub value: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Insertable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::kv_store)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct NewKvStore {
    pub key: String,
    pub value: String,
}

pub fn upsert_kv_store(new_kv: NewKvStore) -> bool {
    use crate::establish_connection;
    use crate::schema::kv_store::dsl::*;

    let conn = &mut establish_connection();

    diesel::insert_into(kv_store)
        .values(&new_kv)
        .on_conflict(key)
        .do_update()
        .set(value.eq(&new_kv.value))
        .execute(conn)
        .is_ok()
}

pub fn get_kv_store(key1: String) -> Option<KvStore> {
    use crate::establish_connection;
    use crate::schema::kv_store::dsl::*;

    let conn = &mut establish_connection();

    kv_store.filter(key.eq(key1)).first::<KvStore>(conn).ok()
}

pub fn list_kv_store() -> Vec<KvStore> {
    use crate::establish_connection;
    use crate::schema::kv_store::dsl::*;

    let conn = &mut establish_connection();

    kv_store.load::<KvStore>(conn).unwrap()
}

#[tauri::command]
pub fn get_kv_store_cmd(key: String) -> Option<String> {
    match get_kv_store(key) {
        Some(kv) => Some(kv.value),
        None => None,
    }
}

#[tauri::command]
pub fn upsert_kv_store_cmd(key: String, value: String) -> bool {
    upsert_kv_store(NewKvStore { key, value })
}

#[tauri::command]
pub fn list_kv_store_cmd() -> Vec<KvStore> {
    list_kv_store()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_upsert_kv_store() {
        let new_kv = NewKvStore {
            key: "test_key".to_string(),
            value: "test_value".to_string(),
        };
        assert!(upsert_kv_store(new_kv));
        assert_eq!(
            get_kv_store("test_key".to_string()).unwrap().value,
            "test_value"
        )
    }
}
