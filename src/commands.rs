use tauri::command;
use chrono::Utc;
use crate::db;
use crate::model::Task;

#[command]
pub fn create_task(title: String, category: String, priority: String, deadline: Option<String>) -> Result<(), String> {
    let now = Utc::now().naive_utc().to_string();

    let task = Task {
        id: 0,
        title,
        category,
        priority,
        deadline,
        completed: false,
        created_at: now.clone(),
        updated_at: now,
    };

    db::insert_task(&task).map_err(|e| e.to_string())
}

#[command]
pub fn fetch_tasks() -> Result<Vec<Task>, String> {
    db::fetch_all_tasks().map_err(|e| e.to_string())
}
