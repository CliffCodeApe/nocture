use rusqlite::{params, Connection};
use crate::model::note::{Note, NotePayload};

pub trait NoteRepository {
    fn create(&self, conn: &Connection, payload: &NotePayload) -> Result<(), rusqlite::Error>;
    fn fetch_all(&self, conn: &Connection) -> Result<Vec<Note>, rusqlite::Error>;
    fn update(&self, conn: &Connection, note: &Note) -> Result<(), rusqlite::Error>;
    fn delete(&self, conn: &Connection, id: i32) -> Result<(), rusqlite::Error>;
}

pub struct SqliteNoteRepository;

impl NoteRepository for SqliteNoteRepository {
    fn create(&self, conn: &Connection, payload: &NotePayload) -> Result<(), rusqlite::Error> {
        conn.execute(
            "INSERT INTO notes (title, file_path) VALUES (?1, ?2)",
            params![payload.title, payload.file_path],
        )?;
        Ok(())
    }

    fn fetch_all(&self, conn: &Connection) -> Result<Vec<Note>, rusqlite::Error> {
        let mut stmt = conn.prepare("SELECT * FROM notes")?;
        let note_iter = stmt.query_map([], |row| {
            Ok(Note {
                id: row.get(0)?,
                title: row.get(1)?,
                file_path: row.get(2)?,
                created_at: row.get(3)?,
                updated_at: row.get(4)?,
            })
        })?;
        Ok(note_iter.filter_map(Result::ok).collect())
    }

    fn update(&self, conn: &Connection, note: &Note) -> Result<(), rusqlite::Error> {
        conn.execute(
            "UPDATE notes SET title = ?1, file_path = ?2, updated_at = CURRENT_TIMESTAMP WHERE id = ?3",
            params![note.title, note.file_path, note.id],
        )?;
        Ok(())
    }

    fn delete(&self, conn: &Connection, id: i32) -> Result<(), rusqlite::Error> {
        conn.execute("DELETE FROM notes WHERE id = ?1", [id])?;
        Ok(())
    }
}