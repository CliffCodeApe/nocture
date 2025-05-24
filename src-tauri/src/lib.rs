// src-tauri/src/lib.rs

// Mendefinisikan module-module dalam crate/library ini
pub mod model;
pub mod repository;
pub mod services;
pub mod commands;
pub mod migrations;

// Import semua command yang relevan dan AppState dari module commands
use commands::{
    // Task Management
    create_task,
    fetch_tasks,
    update_task,
    delete_task,
    // Notes
    create_note,
    fetch_notes,
    update_note,
    delete_note,
    AppState // Struct state yang berisi pool
};

// Import komponen untuk R2D2 (connection pool) dan SQLite
use r2d2_sqlite::SqliteConnectionManager;
use r2d2::Pool;
// Import fungsi migrasi
use migrations::run_migrations;

// Fungsi utama library untuk setup dan menjalankan aplikasi Tauri
pub fn run() {
    // --- PERUBAHAN DIMULAI ---
    // Setup connection manager untuk SQLite, menunjuk ke file database di ROOT project.
    // Path relatif dari direktori kerja `src-tauri` saat `tauri dev` adalah `../`
    let db_path = "../nocture.db";
    let manager = SqliteConnectionManager::file(db_path);
    // --- PERUBAHAN SELESAI ---

    // Buat connection pool dari manager
    let pool = Pool::new(manager).expect("Gagal membuat pool koneksi DB");

    // Blok ini memastikan koneksi yang didapat dari pool untuk migrasi
    // akan otomatis dikembalikan ke pool setelah selesai digunakan.
    {
        // Dapatkan satu koneksi dari pool untuk menjalankan migrasi
        let conn = pool.get().expect("Gagal mendapatkan koneksi dari pool untuk migrasi");
        // Jalankan migrasi (misalnya, CREATE TABLE IF NOT EXISTS)
        run_migrations(&conn).expect("Gagal menjalankan migrasi database");
        // `conn` otomatis kembali ke pool di sini
    }

    // Buat instance AppState yang berisi pool koneksi
    let state = AppState { pool };

    // Bangun (Build) aplikasi Tauri
    tauri::Builder::default()
        // Daftarkan AppState sebagai state yang dikelola Tauri.
        // Ini memungkinkan command untuk mengakses pool melalui `state: State<AppState>`
        .manage(state)
        // Daftarkan semua fungsi command yang bisa dipanggil dari frontend (JavaScript/React)
        .invoke_handler(tauri::generate_handler![
            // Task Management
            create_task,
            fetch_tasks,
            update_task,
            delete_task,
            // Notes
            create_note,
            fetch_notes,
            update_note,
            delete_note
        ])
        // Jalankan aplikasi Tauri dengan context yang digenerate
        .run(tauri::generate_context!())
        .expect("Error saat menjalankan aplikasi Tauri");
}
