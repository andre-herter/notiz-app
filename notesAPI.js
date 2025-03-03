const LOCAL_STORAGE_KEY = "notes-app";

function getNotes() {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
}

function saveNote(title, content, id = undefined) {
  const notes = getNotes();

  if (!id) {
    notes.push({
      title,
      content,
      id: getNextId(),
      lastUpdated: new Date().getTime(),
    });
  } else {
    const indexOffNoteWithId = notes.findIndex((note) => note.id === id);

    if (indexOffNoteWithId > -1) {
      notes[indexOffNoteWithId] = {
        title,
        content,
        id: id,
        lastUpdated: new Date().getTime(),
      };
    }
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
}

function deleteNote(id) {
  if (!id) return;

  const notes = getNotes();

  const filteredNotes = notes.filter((note) => note.id !== Number(id));

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredNotes));
}

function deleteAllNotes() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}

function getNextId() {
  const notes = getNotes();

  const sortedNotes = notes.sort((noteA, noteB) => noteA.id - noteB.id);

  let nextId = 1;

  for (let note of sortedNotes) {
    if (nextId < note.id) break;

    nextId = note.id + 1;
  }

  return nextId;
}
