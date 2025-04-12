use rusqlite::Connection;

pub fn run_migrations(conn: &Connection) -> rusqlite::Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            priority TEXT NOT NULL,
            deadline TEXT,
            completed BOOLEAN NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )",
        [],
    )?;
    Ok(())
}
