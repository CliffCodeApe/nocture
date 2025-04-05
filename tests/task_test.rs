use chrono::NaiveDateTime;

use nocture_tauri_lib::commands::{create_task, fetch_tasks};
use nocture_tauri_lib::model::{Category, Priority, TaskPayload};
use nocture_tauri_lib::db;

#[test]
fn test_create_and_fetch_task() {
    db::init().expect("Failed to run migrations");

    // Buat task dummy
    let deadline = NaiveDateTime::parse_from_str("2025-04-10 23:59:00", "%Y-%m-%d %H:%M:%S").unwrap();

    let payload = TaskPayload {
        title: "Belajar Rust".to_string(),
        category: Category::Study.to_string(),
        priority: Priority::High.to_string(),
        deadline: NaiveDateTime::parse_from_str("2025-04-10 23:59:00", "%Y-%m-%d %H:%M:%S").unwrap(),
    };

    // Jalankan create
    let result = create_task(
        payload.title.clone(),
        payload.category.clone(),
        payload.priority.clone(),
        Some(deadline.format("%Y-%m-%d %H:%M:%S").to_string()),
    );
    match result {
        Ok(_) => println!("Task created successfully."),
        Err(e) => panic!("Failed to create task: {}", e),
    }

    // Fetch dan cek apakah task muncul
    let tasks_result = fetch_tasks();
    match result {
        Ok(_) => println!("Task created successfully."),
        Err(e) => panic!("Failed to create task: {}", e),
    }

    let tasks = tasks_result.unwrap();
    assert!(tasks.iter().any(|t| t.title == payload.title));
}
