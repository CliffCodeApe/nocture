use rusqlite::{params, Connection};
use crate::models::task::{Task, Category, Priority};
use chrono::NaiveDateTime;

pub struct TaskRepository;

impl TaskRepository {
    pub fn create_task(conn: &Connection, task: &Task) -> rusqlite::Result<()> {
        conn.execute(
            "INSERT INTO tasks (title, category, priority, deadline, completed, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);",
            params![
                task.title,
                task.category.as_str(),
                task.priority.as_str(),
                task.deadline.map(|d| d.format("%Y-%m-%d %H:%M:%S").to_string()),
            ],
        )?;
        Ok(())
    }

    pub fn fetch_tasks(conn: &Connection) -> rusqlite::Result<Vec<Task>> {
        let mut stmt = conn.prepare(
            "SELECT id, title, category, priority, deadline, completed, created_at, updated_at FROM tasks;",
        )?;
        let task_iter = stmt.query_map([], |row| {
            Ok(Task {
                id: row.get(0)?,
                title: row.get(1)?,
                category: Category::from_str(&row.get::<_, String>(2)?).unwrap(),
                priority: Priority::from_str(&row.get::<_, String>(3)?).unwrap(),
                deadline: row.get::<_, Option<String>>(4)?.map(|d| NaiveDateTime::parse_from_str(&d, "%Y-%m-%d %H:%M:%S").unwrap()),
                completed: row.get(5)?,
                created_at: NaiveDateTime::parse_from_str(&row.get::<_, String>(6)?, "%Y-%m-%d %H:%M:%S").unwrap(),
                updated_at: NaiveDateTime::parse_from_str(&row.get::<_, String>(7)?, "%Y-%m-%d %H:%M:%S").unwrap(),
            })
        })?;

        let tasks: Vec<Task> = task_iter.collect::<Result<_, _>>()?;
        Ok(tasks)
    }
}
