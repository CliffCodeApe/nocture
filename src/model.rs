use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Task {
    pub id: i32,
    pub title: String,
    pub category: String,
    pub priority: String,
    pub deadline: Option<String>,
    pub completed: bool,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum Category {
    Study,
    Work,
    Personal,
}

impl ToString for Category {
    fn to_string(&self) -> String {
        match self {
            Category::Study => "Study",
            Category::Work => "Work",
            Category::Personal => "Personal",
        }.to_string()
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub enum Priority {
    Low,
    Medium,
    High,
}

impl ToString for Priority {
    fn to_string(&self) -> String {
        match self {
            Priority::Low => "Low",
            Priority::Medium => "Medium",
            Priority::High => "High",
        }.to_string()
    }
}

#[derive(Debug, Clone)]
pub struct TaskPayload {
    pub title: String,
    pub category: String,
    pub priority: String,
    pub deadline: NaiveDateTime,
}