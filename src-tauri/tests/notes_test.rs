use rusqlite::Connection;
use std::path::Path;
use nocture_tauri_lib::services::note::{NoteServiceImpl, NoteService};
use nocture_tauri_lib::model::note::NotePayload;
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

// fn cleanup_notes_folder() {
//     let notes_folder = Path::new("notes");
//     if notes_folder.exists() {
//         for entry in fs::read_dir(notes_folder).unwrap() {
//             let entry = entry.unwrap();
//             let path = entry.path();
//             if path.is_file() {
//                 fs::remove_file(path).ok();
//             }
//         }
//     }
// }

#[test]
fn test_create_and_fetch_note() {
    let conn = setup_conn();
    let service = NoteServiceImpl { repository: SqliteNoteRepository };
    let folder = "notes".to_string();
    let file_name = "test_note.md".to_string();
    let file_path = format!("{}/{}", folder, file_name);
    let payload = NotePayload {
        title: "Test Note".to_string(),
        file_path: file_path.clone(),
    };

    // Create note using the service (which creates the file)
    service.create_note(&conn, payload.clone()).unwrap();

    // Check if file was created
    assert!(Path::new(&file_path).exists());

    // Fetch notes
    let notes = service.fetch_notes(&conn).unwrap();
    assert_eq!(notes.len(), 1);
    assert_eq!(notes[0].title, "Test Note");
    assert_eq!(notes[0].file_path, file_path);

}

#[test]
fn test_update_and_delete_note() {

    let conn = setup_conn();
    let repo = SqliteNoteRepository;

    let file_path = "notes/note.md".to_string();
    let payload = NotePayload {
        title: "Note".to_string(),
        file_path: file_path.clone(),
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

    // Clean up the notes folder
}