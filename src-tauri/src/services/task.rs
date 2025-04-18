use chrono::Utc;
use rusqlite::Connection;
use crate::model::task::{Task, TaskPayload};
use crate::repository::task::{TaskRepository, SqliteTaskRepository};

pub trait TaskService {
    fn create_task(&self, payload: TaskPayload) -> Result<(), String>;
    fn fetch_tasks(&self) -> Result<Vec<Task>, String>;
    fn update_task(&self, task: Task) -> Result<(), String>;
    fn delete_task(&self, id: i32) -> Result<(), String>;

}

pub struct TaskServiceImpl {
    pub conn: Box<Connection>,
    pub repository: SqliteTaskRepository,
}
impl TaskService for TaskServiceImpl{
    fn create_task(&self, payload: TaskPayload) -> Result<(), String> {
        let task = Task {
            id: 0,
            title: payload.title,
            category: payload.category,
            priority: payload.priority,
            deadline: payload.deadline,
            completed: false,
            created_at: Utc::now().naive_utc(),
            updated_at: Utc::now().naive_utc(),
        };

        self.repository.create(self.conn.as_ref(), &task).map_err(|e| e.to_string())
    }

    fn fetch_tasks(&self) -> Result<Vec<Task>, String> {
        self.repository.fetch_all(self.conn.as_ref()).map_err(|e| e.to_string())
    }
    fn update_task(&self, task: Task) -> Result<(), String> {
        self.repository.update(self.conn.as_ref(), &task).map_err(|e| e.to_string())
    }
    
    fn delete_task(&self, id: i32) -> Result<(), String> {
        self.repository.delete(self.conn.as_ref(), id).map_err(|e| e.to_string())
    }
}
