use diesel::{ExpressionMethods, RunQueryDsl, query_dsl::methods::OrderDsl};

use crate::ai_scripts::models;

pub fn list_ai_scripts() -> Vec<models::AiScript> {
    use crate::schema::ai_scripts::dsl::*;
    let connection = &mut crate::establish_connection();
    ai_scripts
        .order(created_at.desc())
        .load::<models::AiScript>(connection)
        .expect("Error loading AI scripts")
}

pub fn remove_ai_script(script_id: i32) -> bool {
    use crate::schema::ai_scripts::dsl::*;
    use diesel::QueryDsl;
    let connection = &mut crate::establish_connection();
    diesel::delete(ai_scripts.filter(id.eq(script_id)))
        .execute(connection)
        .is_ok()
}

pub fn add_ai_script(new_script: models::NewAiScript) -> bool {
    use crate::schema::ai_scripts::dsl::*;
    let connection = &mut crate::establish_connection();
    diesel::insert_into(ai_scripts)
        .values(&new_script)
        .execute(connection)
        .is_ok()
}

pub fn update_ai_script(script_id: i32, updated_script: models::NewAiScript) -> bool {
    use crate::schema::ai_scripts::dsl::*;
    use diesel::QueryDsl;
    let connection = &mut crate::establish_connection();
    diesel::update(ai_scripts.filter(id.eq(script_id)))
        .set((
            uuid.eq(updated_script.uuid),
            name.eq(updated_script.name),
            content.eq(updated_script.content),
        ))
        .execute(connection)
        .is_ok()
}


#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_list_ai_scripts() {
        let scripts = list_ai_scripts();
        for script in scripts {
            println!("ID: {}, Name: {}, Created At: {}", script.id, script.name, script.created_at);
        }
    }
}