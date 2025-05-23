use rusqlite::Connection;
use std::fs::OpenOptions;
use crate::model::note::{Note, NotePayload};
use crate::repository::note::{NoteRepository, SqliteNoteRepository};

pub trait NoteService {
    fn create_note(&self, conn: &Connection, payload: NotePayload) -> Result<(), String>;
    fn fetch_notes(&self, conn: &Connection) -> Result<Vec<Note>, String>;
    fn update_note(&self, conn: &Connection, note: Note) -> Result<(), String>;
    fn delete_note(&self, conn: &Connection, id: i32) -> Result<(), String>;
}

pub struct NoteServiceImpl {
    pub repository: SqliteNoteRepository,
}

impl NoteService for NoteServiceImpl {
    fn create_note(&self, conn: &Connection, payload: NotePayload) -> Result<(), String> {
        if payload.file_path.is_empty() {
            return Err("File path is empty".to_string());
        }

        if let Err(e) = OpenOptions::new()
            .create(true)
            .write(true)
            .append(false)
            .open(&payload.file_path)
        {
            return Err(format!("Failed to create markdown file: {}", e));
        }
        self.repository.create(conn, &payload).map_err(|e| e.to_string())
    }

    fn fetch_notes(&self, conn: &Connection) -> Result<Vec<Note>, String> {
        self.repository.fetch_all(conn).map_err(|e| e.to_string())
    }

    fn update_note(&self, conn: &Connection, note: Note) -> Result<(), String> {
        self.repository.update(conn, &note).map_err(|e| e.to_string())
    }

    fn delete_note(&self, conn: &Connection, id: i32) -> Result<(), String> {
        self.repository.delete(conn, id).map_err(|e| e.to_string())
    }

}