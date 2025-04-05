use crate::models::task::Task;
use rusqlite::Connection;

pub trait TaskRepositoryTrait {
    fn create_task(&self, conn: &Connection, task: &Task) -> rusqlite::Result<()>;
    fn fetch_tasks(&self, conn: &Connection) -> rusqlite::Result<Vec<Task>>;
}
