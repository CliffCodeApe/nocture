use rusqlite::Connection;

mod v0001_create_task;

pub fn run_migrations(conn: &Connection) -> rusqlite::Result<()> {
    v0001_create_task::create_tasks_table(conn)?;
    Ok(())
}
