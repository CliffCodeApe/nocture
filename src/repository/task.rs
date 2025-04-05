use rusqlite::{params, Connection};
use crate::model::task::{Task, Category, Priority};

pub trait TaskRepository {
    fn create(&self, conn: &Connection, task: &Task) -> Result<(), rusqlite::Error>;
    fn fetch_all(&self, conn: &Connection) -> Result<Vec<Task>, rusqlite::Error>;
}

pub struct SqliteTaskRepository;

impl TaskRepository for SqliteTaskRepository {
    fn create(&self, conn: &Connection, task: &Task) -> Result<(), rusqlite::Error> {
        conn.execute(
            "INSERT INTO tasks (title, category, priority, deadline, completed, created_at, updated_at)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
            params![
                task.title,
                task.category.to_string(),
                task.priority.to_string(),
                task.deadline,
                task.completed,
                task.created_at,
                task.updated_at,
            ],
        )?;
        Ok(())
    }

    fn fetch_all(&self, conn: &Connection) -> Result<Vec<Task>, rusqlite::Error> {
        let mut stmt = conn.prepare("SELECT * FROM tasks")?;
        let task_iter = stmt.query_map([], |row| {
            let category_str: String = row.get(2)?;
            let priority_str: String = row.get(3)?;
            Ok(Task {
                id: row.get(0)?,
                title: row.get(1)?,
                category: category_str.parse().unwrap_or(Category::Personal),
                priority: priority_str.parse().unwrap_or(Priority::Low),
                deadline: row.get(4)?,
                completed: row.get(5)?,
                created_at: row.get(6)?,
                updated_at: row.get(7)?,
            })
        })?;
        Ok(task_iter.filter_map(Result::ok).collect())
    }
}
