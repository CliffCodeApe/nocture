use chrono::NaiveDateTime;
use rusqlite::Connection;

use nocture_tauri_lib::{
    migrations::run_migrations,
    model::task::{Category, Priority, TaskPayload},
    repository::task::SqliteTaskRepository,
    services::task::{TaskService, TaskServiceImpl},
};

fn setup_test_service() -> impl TaskService {
    let conn = Connection::open_in_memory().expect("Failed to create in-memory DB");
    run_migrations(&conn).expect("Failed to run migrations");

    TaskServiceImpl {
        conn: Box::new(conn),
        repository: SqliteTaskRepository,
    }
}
#[test]
fn test_create_and_fetch_task() {
    let service = setup_test_service();

    let deadline = NaiveDateTime::parse_from_str("2025-04-10 23:59:00", "%Y-%m-%d %H:%M:%S").unwrap();

    let payload = TaskPayload {
        title: "Belajar Rust".to_string(),
        category: Category::Study,
        priority: Priority::High,
        deadline: Some(deadline),
    };

    let title = payload.title.clone(); // Simpan title sebelum payload dipindahkan
    // Create Task
    service.create_task(payload).expect("Failed to create task");

    // Fetch Tasks
    let tasks = service.fetch_tasks().expect("Failed to fetch tasks");

    // Check Task exists
    assert!(tasks.iter().any(|t| t.title == title));
}
#[test]
fn test_update_and_delete_task() {
    let service = setup_test_service();

    let deadline = NaiveDateTime::parse_from_str("2025-04-10 23:59:00", "%Y-%m-%d %H:%M:%S").unwrap();
    let payload = TaskPayload {
        title: "Task awal".to_string(),
        category: Category::Study,
        priority: Priority::Low,
        deadline: Some(deadline),
    };

    service.create_task(payload.clone()).unwrap();
    let mut tasks = service.fetch_tasks().unwrap();
    assert_eq!(tasks.len(), 1);

    let mut task = tasks.remove(0);
    task.title = "Task Updated".to_string();
    service.update_task(task.clone()).unwrap();

    let tasks_after_update = service.fetch_tasks().unwrap();
    assert_eq!(tasks_after_update[0].title, "Task Updated");

    // Delete Task
    service.delete_task(task.id).unwrap();
    let final_tasks = service.fetch_tasks().unwrap();
    assert_eq!(final_tasks.len(), 0);
}

