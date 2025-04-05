use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum Category {
    Study,
    Work,
    Personal,
}

impl ToString for Category {
    fn to_string(&self) -> String {
        match self {
            Category::Study => "Study".to_string(),
            Category::Work => "Work".to_string(),
            Category::Personal => "Personal".to_string(),
        }
    }
}

impl std::str::FromStr for Category {
    type Err = ();

    fn from_str(input: &str) -> Result<Category, Self::Err> {
        match input {
            "Study" => Ok(Category::Study),
            "Work" => Ok(Category::Work),
            "Personal" => Ok(Category::Personal),
            _ => Err(()),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum Priority {
    Low,
    Medium,
    High,
}

impl ToString for Priority {
    fn to_string(&self) -> String {
        match self {
            Priority::Low => "Low".to_string(),
            Priority::Medium => "Medium".to_string(),
            Priority::High => "High".to_string(),
        }
    }
}

impl std::str::FromStr for Priority {
    type Err = ();

    fn from_str(input: &str) -> Result<Priority, Self::Err> {
        match input {
            "Low" => Ok(Priority::Low),
            "Medium" => Ok(Priority::Medium),
            "High" => Ok(Priority::High),
            _ => Err(()),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaskPayload {
    pub title: String,
    pub category: Category,
    pub priority: Priority,
    pub deadline: Option<NaiveDateTime>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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
