use rusqlite::Connection;
use std::fs::OpenOptions;
use std::io::Write;
use crate::model::note::{Note, NotePayload};
use crate::repository::note::{NoteRepository, SqliteNoteRepository};
use std::path::Path;

pub trait NoteService {
    fn create_note(&self, conn: &Connection, payload: NotePayload) -> Result<(), String>;
    fn fetch_notes(&self, conn: &Connection) -> Result<Vec<Note>, String>;
    fn update_note(&self, conn: &Connection, note: Note, new_content: &str) -> Result<(), String>;
    fn delete_note(&self, conn: &Connection, id: i32) -> Result<(), String>;
}

pub struct NoteServiceImpl {
    pub repository: SqliteNoteRepository,
}

impl NoteService for NoteServiceImpl {
    fn create_note(&self, conn: &Connection, payload: NotePayload) -> Result<(), String> {
        let file_path = Path::new(&payload.file_path);
        if let Some(parent) = file_path.parent() {
            if !parent.exists() {
                std::fs::create_dir_all(parent)
                    .map_err(|e| format!("Failed to create notes folder: {}", e))?;
            }
        }
        OpenOptions::new()
            .create(true)
            .write(true)
            .open(&file_path)
            .map_err(|e| format!("Failed to create markdown file: {}", e))?;
        self.repository.create(conn, &payload).map_err(|e| e.to_string())
    }

    fn fetch_notes(&self, conn: &Connection) -> Result<Vec<Note>, String> {
        self.repository.fetch_all(conn).map_err(|e| e.to_string())
    }

    fn update_note(&self, conn: &Connection, note: Note, new_content: &str) -> Result<(), String> {
        // Update title in DB
        self.repository.update(conn, &note).map_err(|e| e.to_string())?;
    
        // Overwrite file content
        let file_path = &note.file_path;
        let mut file = OpenOptions::new().write(true).truncate(true).open(file_path)
            .map_err(|e| format!("Failed to open note file: {}", e))?;
        file.write_all(new_content.as_bytes())
            .map_err(|e| format!("Failed to write note file: {}", e))?;
    
        Ok(())
    }

    fn delete_note(&self, conn: &Connection, id: i32) -> Result<(), String> {
        let file_path = self.repository.get_file_path_by_id(conn, id)
        .map_err(|e| format!("Failed to get file_path: {}", e))?;

        // Delete the file if it exists
        if let Some(path) = file_path {
            let path = std::path::Path::new(&path);
            if path.exists() {
                std::fs::remove_file(path).ok();
            }
        }

        self.repository.delete(conn, id).map_err(|e| e.to_string())
    }

}