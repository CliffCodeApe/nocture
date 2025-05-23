use rusqlite::Connection;
use nocture_tauri_lib::model::note::{NotePayload, Note};
use nocture_tauri_lib::repository::note::{SqliteNoteRepository, NoteRepository};

fn setup_conn() -> Connection {
    let conn = Connection::open_in_memory().unwrap();
    conn.execute(
        "CREATE TABLE notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            file_path TEXT UNIQUE NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )",
        [],
    ).unwrap();
    conn
}

#[test]
fn test_create_and_fetch_note() {
    let conn = setup_conn();
    let repo = SqliteNoteRepository;

    let payload = NotePayload {
        title: "Test Note".to_string(),
        file_path: "/tmp/test_note.md".to_string(),
    };

    // Create note
    repo.create(&conn, &payload).unwrap();

    // Fetch notes
    let notes = repo.fetch_all(&conn).unwrap();
    assert_eq!(notes.len(), 1);
    assert_eq!(notes[0].title, "Test Note");
    assert_eq!(notes[0].file_path, "/tmp/test_note.md");
}

#[test]
fn test_update_and_delete_note() {
    let conn = setup_conn();
    let repo = SqliteNoteRepository;

    let payload = NotePayload {
        title: "Note".to_string(),
        file_path: "/tmp/note.md".to_string(),
    };
    repo.create(&conn, &payload).unwrap();

    let mut notes = repo.fetch_all(&conn).unwrap();
    let mut note = notes.remove(0);
    note.title = "Updated".to_string();
    repo.update(&conn, &note).unwrap();

    let notes = repo.fetch_all(&conn).unwrap();
    assert_eq!(notes[0].title, "Updated");

    repo.delete(&conn, notes[0].id).unwrap();
    let notes = repo.fetch_all(&conn).unwrap();
    assert!(notes.is_empty());
}