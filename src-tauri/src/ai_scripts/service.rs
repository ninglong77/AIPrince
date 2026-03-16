use diesel::{query_dsl::methods::OrderDsl, ExpressionMethods, RunQueryDsl};

use crate::ai_scripts::models;

pub fn list_ai_scripts() -> Vec<models::AiScript> {
    use crate::schema::ai_scripts::dsl::*;
    let connection = &mut crate::establish_connection();
    ai_scripts
        .order(created_at.desc())
        .load::<models::AiScript>(connection)
        .expect("Error loading AI scripts")
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