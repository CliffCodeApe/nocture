use rusqlite::Connection;
use std::sync::Arc;
use tauri::async_runtime::Mutex;

pub mod migrations;
pub mod models;
pub mod repository;
pub mod services;
pub mod handlers;
pub mod dto;
pub mod contract;

use handlers::task::{create_task_handler, fetch_tasks_handler};
use contract::services::TaskService; // ✅ Import trait
use services::task::TaskServiceImpl; // ✅ Import implementasi trait

#[derive(Clone)]
pub struct AppState {
    pub conn: Arc<Mutex<Connection>>,
    pub task_service: Arc<dyn TaskService + Send + Sync>, // ✅ Gunakan trait
}

impl AppState {
    /// Inisialisasi state untuk aplikasi (file-based, digunakan saat run)
    pub fn init() -> Self {
        let conn = Connection::open("nocture.db").expect("Failed to open DB");
        migrations::run_migrations(&conn).expect("Failed to run migrations");

        let task_service = TaskServiceImpl {
            conn: conn
                .try_clone()
                .expect("Failed to clone DB connection for TaskService"),
        };

        AppState {
            conn: Arc::new(Mutex::new(conn)),
            task_service: Arc::new(task_service),
        }
    }

    /// Inisialisasi state untuk testing (in-memory)
    pub fn new() -> Result<Self, String> {
        let conn = Connection::open_in_memory().map_err(|e| e.to_string())?;
        migrations::run_migrations(&conn).map_err(|e| e.to_string())?;

        let task_service = TaskServiceImpl {
            conn: conn
                .try_clone()
                .map_err(|e| format!("Failed to clone DB connection: {}", e))?,
        };

        Ok(AppState {
            conn: Arc::new(Mutex::new(conn)),
            task_service: Arc::new(task_service),
        })
    }

    /// Ambil koneksi (digunakan dalam service async)
    pub async fn get_conn(&self) -> tokio::sync::MutexGuard<'_, Connection> {
        self.conn.lock().await
    }
}

/// Untuk test (dipanggil dari test file)
pub fn init_app() -> AppState {
    AppState::new().expect("Failed to init test AppState")
}

pub fn run() {
    let app_state = AppState::init();

    tauri::Builder::default()
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![
            create_task_handler,
            fetch_tasks_handler,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
