// src-tauri/src/commands.rs

// --- PERUBAHAN DIMULAI ---
// Import State dari Tauri untuk state management
use tauri::State;
// --- PERUBAHAN SELESAI ---

use crate::services::task::{TaskServiceImpl, TaskService};
use crate::repository::task::SqliteTaskRepository;
use crate::model::task::{Task, TaskPayload};
use r2d2::Pool;
use r2d2_sqlite::SqliteConnectionManager;

// Definisi tipe alias untuk Pool (tetap sama)
pub type DbPool = Pool<SqliteConnectionManager>;

// Struct untuk state aplikasi yang akan dikelola Tauri (tetap sama)
pub struct AppState {
    pub pool: DbPool,
}

#[tauri::command]
// --- PERUBAHAN DIMULAI ---
// Tambahkan `state: State<AppState>` sebagai argumen pertama
pub fn create_task(state: State<AppState>, payload: TaskPayload) -> Result<(), String> {
    // Hapus baris ini: let conn = rusqlite::Connection::open("nocture.db").map_err(|e| e.to_string())?;

    // Dapatkan koneksi dari pool yang dikelola oleh Tauri state
    let conn = state.pool.get().map_err(|e| format!("Gagal mendapatkan koneksi dari pool: {}", e))?;

    // Buat instance service (tidak perlu field `conn` lagi di struct)
    let service = TaskServiceImpl {
        repository: SqliteTaskRepository,
    };

    // Panggil method service dengan `conn` dari pool sebagai argumen
    service.create_task(&conn, payload)
    // --- PERUBAHAN SELESAI ---
}

#[tauri::command]
// --- PERUBAHAN DIMULAI ---
// Tambahkan `state: State<AppState>` sebagai argumen pertama
pub fn fetch_tasks(state: State<AppState>) -> Result<Vec<Task>, String> {
    // Hapus baris ini: let conn = rusqlite::Connection::open("nocture.db").map_err(|e| e.to_string())?;

    // Dapatkan koneksi dari pool
    let conn = state.pool.get().map_err(|e| format!("Gagal mendapatkan koneksi dari pool: {}", e))?;

    // Buat instance service
    let service = TaskServiceImpl {
        repository: SqliteTaskRepository,
    };

    // Panggil method service dengan `conn` dari pool
    service.fetch_tasks(&conn)
    // --- PERUBAHAN SELESAI ---
}

#[tauri::command]
// --- PERUBAHAN DIMULAI ---
// Tambahkan `state: State<AppState>` sebagai argumen pertama
pub fn update_task(state: State<AppState>, task: Task) -> Result<(), String> {
    // Hapus baris ini: let conn = rusqlite::Connection::open("nocture.db").map_err(|e| e.to_string())?;

    // Dapatkan koneksi dari pool
    let conn = state.pool.get().map_err(|e| format!("Gagal mendapatkan koneksi dari pool: {}", e))?;

    // Buat instance service
    let service = TaskServiceImpl {
        repository: SqliteTaskRepository,
    };

    // Panggil method service dengan `conn` dari pool
    // Pastikan field updated_at di `task` sudah diperbarui di frontend atau sebelum memanggil command ini jika perlu
    service.update_task(&conn, task)
    // --- PERUBAHAN SELESAI ---
}

#[tauri::command]
// --- PERUBAHAN DIMULAI ---
// Tambahkan `state: State<AppState>` sebagai argumen pertama
pub fn delete_task(state: State<AppState>, id: i32) -> Result<(), String> {
    // Hapus baris ini: let conn = rusqlite::Connection::open("nocture.db").map_err(|e| e.to_string())?;

    // Dapatkan koneksi dari pool
    let conn = state.pool.get().map_err(|e| format!("Gagal mendapatkan koneksi dari pool: {}", e))?;

    // Buat instance service
    let service = TaskServiceImpl {
        repository: SqliteTaskRepository,
    };

    // Panggil method service dengan `conn` dari pool
    service.delete_task(&conn, id)
    // --- PERUBAHAN SELESAI ---
}
