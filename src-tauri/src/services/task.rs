// src-tauri/src/services/task.rs

use chrono::{Utc, NaiveDateTime, NaiveDate};
// Import Connection dari rusqlite
use rusqlite::Connection;
use crate::model::task::{Task, TaskPayload};
use crate::repository::task::{TaskRepository, SqliteTaskRepository};

// Trait (interface) untuk TaskService
pub trait TaskService {
    // --- PERUBAHAN DIMULAI ---
    // Ubah signature method untuk menerima &Connection sebagai argumen
    fn create_task(&self, conn: &Connection, payload: TaskPayload) -> Result<(), String>;
    fn fetch_tasks(&self, conn: &Connection) -> Result<Vec<Task>, String>;
    fn update_task(&self, conn: &Connection, task: Task) -> Result<(), String>;
    fn delete_task(&self, conn: &Connection, id: i32) -> Result<(), String>;
    // --- PERUBAHAN SELESAI ---
}

// Implementasi konkret dari TaskService
pub struct TaskServiceImpl {
    // --- PERUBAHAN DIMULAI ---
    // Hapus field `conn` dari struct, karena koneksi akan di-pass sebagai argumen method
    // pub conn: Box<Connection>,
    // --- PERUBAHAN SELESAI ---
    pub repository: SqliteTaskRepository, // Repository tetap ada
}

// Implementasi method untuk TaskServiceImpl
impl TaskService for TaskServiceImpl {
    // --- PERUBAHAN DIMULAI ---
    // Implementasi fungsi create_task dengan signature baru (menerima &Connection)
    fn create_task(&self, conn: &Connection, payload: TaskPayload) -> Result<(), String> {
    // --- PERUBAHAN SELESAI ---

        // Logika parsing deadline (tetap sama)
        let parsed_deadline: Option<NaiveDateTime> = payload.deadline
            .and_then(|date_str| {
                if let Ok(naive_date) = NaiveDate::parse_from_str(&date_str, "%Y-%m-%d") {
                    // Menggunakan and_hms_opt untuk menghindari panic jika tanggal tidak valid
                    naive_date.and_hms_opt(0, 0, 0)
                } else {
                    eprintln!("Gagal parse deadline string: {}", date_str); // Log error parsing
                    None
                }
            });

        // Membuat instance Task (tetap sama)
        let task = Task {
            id: 0, // ID akan digenerate oleh database
            title: payload.title,
            category: payload.category,
            priority: payload.priority,
            deadline: parsed_deadline,
            completed: false, // Task baru defaultnya belum selesai
            created_at: Utc::now().naive_utc(), // Waktu sekarang (UTC, naive)
            updated_at: Utc::now().naive_utc(), // Waktu sekarang (UTC, naive)
        };

        // --- PERUBAHAN DIMULAI ---
        // Panggil method repository dengan `conn` yang di-pass sebagai argumen
        self.repository.create(conn, &task).map_err(|e| e.to_string())
        // --- PERUBAHAN SELESAI ---
    }

    // --- PERUBAHAN DIMULAI ---
    // Implementasi fungsi fetch_tasks dengan signature baru (menerima &Connection)
    fn fetch_tasks(&self, conn: &Connection) -> Result<Vec<Task>, String> {
        // Panggil method repository dengan `conn` yang di-pass sebagai argumen
        self.repository.fetch_all(conn).map_err(|e| e.to_string())
    }
    // --- PERUBAHAN SELESAI ---

    // --- PERUBAHAN DIMULAI ---
    // Implementasi fungsi update_task dengan signature baru (menerima &Connection)
    fn update_task(&self, conn: &Connection, task: Task) -> Result<(), String> {
        // Panggil method repository dengan `conn` yang di-pass sebagai argumen
        // Pastikan Task memiliki field updated_at yang diperbarui sebelum memanggil ini jika perlu
        self.repository.update(conn, &task).map_err(|e| e.to_string())
    }
    // --- PERUBAHAN SELESAI ---

    // --- PERUBAHAN DIMULAI ---
    // Implementasi fungsi delete_task dengan signature baru (menerima &Connection)
    fn delete_task(&self, conn: &Connection, id: i32) -> Result<(), String> {
        // Panggil method repository dengan `conn` yang di-pass sebagai argumen
        self.repository.delete(conn, id).map_err(|e| e.to_string())
    }
    // --- PERUBAHAN SELESAI ---
}
