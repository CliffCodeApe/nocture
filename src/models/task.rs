use serde::{Deserialize, Serialize};
use chrono::NaiveDateTime;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum Category {
    Study,
    Work,
    Personal,
}

impl Category {
    pub fn from_str(value: &str) -> Option<Self> {
        match value {
            "study" => Some(Self::Study),
            "work" => Some(Self::Work),
            "personal" => Some(Self::Personal),
            _ => None,
        }
    }

    pub fn as_str(&self) -> &str {
        match self {
            Self::Study => "study",
            Self::Work => "work",
            Self::Personal => "personal",
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum Priority {
    Low,
    Medium,
    High,
}

impl Priority {
    pub fn from_str(value: &str) -> Option<Self> {
        match value {
            "low" => Some(Self::Low),
            "medium" => Some(Self::Medium),
            "high" => Some(Self::High),
            _ => None,
        }
    }

    pub fn as_str(&self) -> &str {
        match self {
            Self::Low => "low",
            Self::Medium => "medium",
            Self::High => "high",
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Task {
    pub id: i32,
    pub title: String,
    pub category: Category,
    pub priority: Priority,
    pub deadline: Option<NaiveDateTime>,
    pub completed: bool,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}
