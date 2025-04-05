use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

use crate::models::task::{Category, Priority};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaskPayload {
    pub title: String,
    pub category: Category,
    pub priority: Priority,
    pub deadline: Option<NaiveDateTime>,
}
