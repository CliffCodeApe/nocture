pub mod model;
pub mod repository;
pub mod services;
pub mod commands;
pub mod migrations;

use commands::{create_task, fetch_tasks, AppState};
use r2d2_sqlite::SqliteConnectionManager;
use r2d2::Pool;
use migrations::run_migrations;

pub fn run() {
    let manager = SqliteConnectionManager::file("nocture.db");
    let pool = Pool::new(manager).expect("Failed to create pool");

    // Jalankan migrasi saat startup
    {
        let conn = pool.get().expect("Failed to get connection from pool");
        run_migrations(&conn).expect("Failed to run migrations");
    }

    let state = AppState { pool };

    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![create_task, fetch_tasks])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
