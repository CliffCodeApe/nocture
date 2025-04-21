// src-tauri/src/model/task.rs

// Import NaiveDateTime dari chrono dan Serialize/Deserialize dari serde
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

// Enum untuk Kategori Task
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum Category {
    Study,
    Work,
    Personal,
}

// Implementasi untuk mengubah Category menjadi String
impl ToString for Category {
    fn to_string(&self) -> String {
        match self {
            Category::Study => "Study".to_string(),
            Category::Work => "Work".to_string(),
            Category::Personal => "Personal".to_string(),
        }
    }
}

// Implementasi untuk mengubah String menjadi Category
impl std::str::FromStr for Category {
    type Err = ();

    fn from_str(input: &str) -> Result<Category, Self::Err> {
        match input {
            "Study" => Ok(Category::Study),
            "Work" => Ok(Category::Work),
            "Personal" => Ok(Category::Personal),
            _ => Err(()), // Kembalikan error jika string tidak cocok
        }
    }
}

// Enum untuk Prioritas Task
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum Priority {
    Low,
    Medium,
    High,
}

// Implementasi untuk mengubah Priority menjadi String
impl ToString for Priority {
    fn to_string(&self) -> String {
        match self {
            Priority::Low => "Low".to_string(),
            Priority::Medium => "Medium".to_string(),
            Priority::High => "High".to_string(),
        }
    }
}

// Implementasi untuk mengubah String menjadi Priority
impl std::str::FromStr for Priority {
    type Err = ();

    fn from_str(input: &str) -> Result<Priority, Self::Err> {
        match input {
            "Low" => Ok(Priority::Low),
            "Medium" => Ok(Priority::Medium),
            "High" => Ok(Priority::High),
            _ => Err(()), // Kembalikan error jika string tidak cocok
        }
    }
}

// Struct untuk payload data saat membuat task baru (data dari frontend)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaskPayload {
    pub title: String,
    pub category: Category, // Enum Category
    pub priority: Priority, // Enum Priority
    // --- PERUBAHAN DIMULAI ---
    // Terima deadline sebagai String opsional dari frontend
    pub deadline: Option<String>,
    // --- PERUBAHAN SELESAI ---
}

// Struct untuk representasi Task secara lengkap (termasuk data dari DB)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Task {
    pub id: i32,
    pub title: String,
    pub category: Category,
    pub priority: Priority,
    pub deadline: Option<NaiveDateTime>, // Di DB tetap NaiveDateTime
    pub completed: bool,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}
