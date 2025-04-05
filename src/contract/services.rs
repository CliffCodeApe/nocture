use crate::dto::task::TaskPayload;
use crate::models::task::Task;

pub trait TaskService: Send + Sync {
    fn create_task(&self, payload: TaskPayload) -> Result<(), String>;
    fn fetch_tasks(&self) -> Result<Vec<Task>, String>;
}
