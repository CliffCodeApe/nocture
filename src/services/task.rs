use crate::contract::services::TaskService as TaskServiceTrait;
use crate::dto::task::TaskPayload;
use crate::models::task::Task;
use crate::repository::task::TaskRepository;

use chrono::Utc;
use rusqlite::Connection;

pub struct TaskService {
    pub conn: Connection,
}

impl TaskServiceTrait for TaskService {
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

        TaskRepository::create_task(&self.conn, &task).map_err(|e| e.to_string())
    }

    fn fetch_tasks(&self) -> Result<Vec<Task>, String> {
        TaskRepository::fetch_tasks(&self.conn).map_err(|e| e.to_string())
    }
}
