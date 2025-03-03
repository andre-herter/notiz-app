const notesListEl = document.querySelector(".notes-list");
const saveButtonEl = document.querySelector(".save-btn");
const createNewBtnEl = document.querySelector(".create-new-btn");
const deleteButtonEl = document.querySelector(".delete-btn");
const deleteAllNotesButtonEl = document.querySelector(".delete-all-notes-btn");
const titleInputEl = document.getElementById("title-input");
const contentInputEl = document.getElementById("text-input");

saveButtonEl.addEventListener("click", clickSaveButton);
createNewBtnEl.addEventListener("click", newNote);
deleteButtonEl.addEventListener("click", clickDeleteButton);
deleteAllNotesButtonEl.addEventListener("click", clickDeleteAllNotes);

displayNotesList();
applyListeners();
removeDeleteAllNotesButton();

function applyListeners() {
  const noteEntriesEls = document.querySelectorAll(".note-entry");

  noteEntriesEls.forEach((noteEntry) => {
    noteEntry.addEventListener("click", () =>
      selectNode(noteEntry.getAttribute("data-id"))
    );
  });
}

function displayNotesList() {
  const notes = getNotes();

  const sortedNotes = notes.sort(
    (noteA, noteB) => noteB.lastUpdated - noteA.lastUpdated
  );

  let html = "";

  sortedNotes.forEach((note) => {
    html += `
    <div class="note-entry" data-id="${note.id}">
        <div class="note-title">${escapeHtml(note.title)}</div>
        <div class="note-content-teaser">${escapeHtml(note.content)}</div>
        <div class="note-date">
        ${new Date(note.lastUpdated).toLocaleString("de-DE")}
        </div>
    </div>
`;
  });

  notesListEl.innerHTML = html;
}

function clickSaveButton() {
  const title = titleInputEl.value;
  const content = contentInputEl.value;

  if (!title || !content) {
    alert("Bitte Titel und Inhalt eingeben");
    return;
  }

  saveNote(title, content, Number(getCurrentlySelectedId()));

  titleInputEl.value = "";
  contentInputEl.value = "";

  displayNotesList();
  applyListeners();
  removeDeleteAllNotesButton();
}

function clickDeleteButton() {
  const currentlySelectedId = getCurrentlySelectedId();

  if (!currentlySelectedId) return;

  deleteNote(currentlySelectedId);

  titleInputEl.value = "";
  contentInputEl.value = "";

  displayNotesList();
  applyListeners();
  removeDeleteAllNotesButton();
}

function clickDeleteAllNotes() {
  deleteAllNotes();

  displayNotesList();
  applyListeners();
  removeDeleteAllNotesButton();
}

function removeDeleteAllNotesButton() {
  if (notesListEl.children.length === 0) {
    deleteAllNotesButtonEl.classList.remove("visible");
    deleteAllNotesButtonEl.classList.add("hidden");
  } else {
    deleteAllNotesButtonEl.classList.remove("hidden");
    deleteAllNotesButtonEl.classList.add("visible");
  }
}

function selectNode(id) {
  const selectedNodeEl = document.querySelector(`.note-entry[data-id="${id}"]`);

  if (selectedNodeEl.classList.contains("selected-note")) return;

  removeSelectedClass();

  selectedNodeEl.classList.add("selected-note");

  const notes = getNotes();

  const selectedNode = notes.find((note) => note.id === Number(id));

  if (!selectNode) return;

  titleInputEl.value = selectedNode.title;
  contentInputEl.value = selectedNode.content;
}

function newNote() {
  titleInputEl.value = "";
  contentInputEl.value = "";

  removeSelectedClass();
}

function removeSelectedClass() {
  const noteEntriesEls = document.querySelectorAll(".note-entry");
  noteEntriesEls.forEach((noteEntry) => {
    noteEntry.classList.remove("selected-note");
  });
}

function getCurrentlySelectedId() {
  let currentId = undefined;

  const currentlySelectedNoteEl = document.querySelector(".selected-note");

  if (currentlySelectedNoteEl) {
    currentId = currentlySelectedNoteEl.getAttribute("data-id");
  }

  return currentId;
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
