use crate::services::task::{TaskServiceImpl, TaskService};
use crate::repository::task::SqliteTaskRepository;
use crate::model::task::{Task, TaskPayload};
use r2d2::Pool;
use r2d2_sqlite::SqliteConnectionManager;

pub type DbPool = Pool<SqliteConnectionManager>;

pub struct AppState {
    pub pool: DbPool,
}

#[tauri::command]
pub fn create_task(payload: TaskPayload) -> Result<(), String> {
    let conn = rusqlite::Connection::open("nocture.db").map_err(|e| e.to_string())?;
    let service = TaskServiceImpl {
        conn: Box::new(conn),
        repository: SqliteTaskRepository,
    };
    service.create_task(payload)
}

#[tauri::command]
pub fn fetch_tasks() -> Result<Vec<Task>, String> {
    let conn = rusqlite::Connection::open("nocture.db").map_err(|e| e.to_string())?;
    let service = TaskServiceImpl {
        conn: Box::new(conn),
        repository: SqliteTaskRepository,
    };
    service.fetch_tasks()
}