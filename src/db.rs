use rusqlite::{params, Connection};
use std::sync::Mutex;
use once_cell::sync::Lazy;
use crate::model::Task;  // Only import what's needed

pub static DB: Lazy<Mutex<Connection>> = Lazy::new(|| {
    let conn = Connection::open("nocture.db").expect("DB failed");
    // Enable WAL mode for better concurrency
    conn.pragma_update(None, "journal_mode", "WAL").unwrap();
    // Enable foreign keys
    conn.pragma_update(None, "foreign_keys", "ON").unwrap();
    Mutex::new(conn)
});

pub fn init() -> rusqlite::Result<()> {
    let conn = DB.lock().unwrap();
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL CHECK(category IN ('Study', 'Work', 'Personal')),
            priority TEXT NOT NULL CHECK(priority IN ('Low', 'Medium', 'High')),
            deadline TEXT,
            completed INTEGER DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TRIGGER IF NOT EXISTS update_task_timestamp
        AFTER UPDATE ON tasks
        BEGIN
            UPDATE tasks SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
        END;"
    )?;
    Ok(())
}

pub fn insert_task(task: &Task) -> rusqlite::Result<()> {
    let conn = DB.lock().unwrap();
    conn.execute(
        "INSERT INTO tasks (title, category, priority, deadline, completed)
         VALUES (?, ?, ?, ?, ?)",
        params![
            task.title,
            task.category.to_string(),
            task.priority.to_string(),
            task.deadline,
            task.completed as i32,
        ],
    )?;
    Ok(())
}

pub fn fetch_all_tasks() -> rusqlite::Result<Vec<Task>> {
    let conn = DB.lock().unwrap();
    let mut stmt = conn.prepare("SELECT * FROM tasks")?;
    let tasks = stmt
        .query_map([], |row| {
            Ok(Task {
                id: row.get(0)?,
                title: row.get(1)?,
                category: row.get(2)?,
                priority: row.get(3)?,
                deadline: row.get(4)?,
                completed: row.get::<_, i32>(5)? != 0,
                created_at: row.get(6)?,
                updated_at: row.get(7)?,
            })
        })?
        .collect::<rusqlite::Result<Vec<_>>>()?;
    Ok(tasks)
}