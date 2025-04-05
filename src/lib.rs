pub mod db;
pub mod model;
pub mod commands;

pub use commands::{create_task, fetch_tasks};

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            create_task,
            fetch_tasks
        ])
        .setup(|_app| {
            db::init().expect("Failed to init DB");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Error while running Tauri app");
}