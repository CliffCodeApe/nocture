use nocture_tauri_lib::{
    init_app,
    dto::task::TaskPayload,
    models::task::{Category, Priority},
};
use chrono::NaiveDateTime;

#[test]
fn test_create_and_fetch_task_via_service() {
    let app_state = init_app();
    let task_service = &app_state.task_service;

    let payload = TaskPayload {
        title: "Service Task Test".to_string(),
        category: Category::Study,
        priority: Priority::High,
        deadline: Some(NaiveDateTime::parse_from_str("2025-04-05 00:00:00", "%Y-%m-%d %H:%M:%S").unwrap()),
    };

    let create_result = task_service.create_task(payload.clone());
    assert!(create_result.is_ok(), "Task creation via service should succeed");

    let fetch_result = task_service.fetch_tasks();
    assert!(fetch_result.is_ok(), "Task fetch via service should succeed");

    let tasks = fetch_result.unwrap();
    assert!(
        tasks.iter().any(|t| t.title == payload.title),
        "Created task should appear in fetched task list"
    );
}
