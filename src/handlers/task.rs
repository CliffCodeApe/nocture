use tauri::State;
use crate::{AppState, dto::task::TaskPayload};

#[tauri::command]
pub async fn create_task_handler(
    state: State<'_, AppState>,
    payload: TaskPayload,
) -> Result<String, String> {
    let service = &state.task_service;
    service
        .create_task(payload)
        .map(|_| "Task created successfully".to_string())
}

#[tauri::command]
pub async fn fetch_tasks_handler(
    state: State<'_, AppState>,
) -> Result<Vec<String>, String> {
    let service = &state.task_service;
    service
        .fetch_tasks()
        .map(|tasks| tasks.into_iter().map(|t| t.title).collect())
}
