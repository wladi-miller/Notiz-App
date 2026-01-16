let notes = [];
let activeNoteId = null;

function formatDate(date) {
  return new Date(date).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getNextId() {
  return notes.length + 1;
}

function normalizeIds() {
  notes.forEach((note, index) => {
    note.id = index + 1;
  });
}

function sortNotesByID() {
  notes.sort((a, b) => new Date(b.id) - new Date(a.id));
}

document.addEventListener("DOMContentLoaded", () => {
  const savedNotes = localStorage.getItem("notes");

  if (savedNotes) {
    const parsedNotes = JSON.parse(savedNotes);

    if (Array.isArray(parsedNotes)) {
      notes = parsedNotes;
    } else {
      notes = [];
    }
    sortNotesByID();
    renderNotesList();
  }
});

function newNote() {
  activeNoteId = null;
  document.getElementById("noteTitle").value = "";
  document.getElementById("noteContent").value = "";
}

function saveNotes() {
  const title = document.getElementById("noteTitle").value.trim();
  const content = document.getElementById("noteContent").value.trim();

  if (!title || !content) {
    if (!title && !content) {
      alert("Die Notiz ist leer 😅");
      return;
    }
    if (!title) {
      alert("Bitte Titel ergänzen 😅");
      return;
    }

    if (!content) {
      alert("Bitte Inhalt ergänzen 😅");
      return;
    }
  }

  if (activeNoteId) {
    const note = notes.find((n) => n.id === activeNoteId);
    note.title = title;
    note.content = content;
  } else {
    const newNote = {
      id: getNextId(),
      title,
      content,
      createdAt: new Date(),
    };
    notes.push(newNote);
    activeNoteId = newNote.id;
  }

  sortNotesByID();
  saveToLocalStorage();
  renderNotesList();
  newNote();
}

function renderNotesList() {
  const list = document.getElementById("sidebarNotesList");
  list.innerHTML = "";

  if (notes.length === 0) {
    list.innerHTML = `<p class="empty-message">Keine Notizen vorhanden</p>`;
    return;
  }

  notes.sort((a, b) => new Date(b.id) - new Date(a.id));

  notes.forEach((note) => {
    const item = document.createElement("div");
    item.className = "note-item";

    item.innerHTML = `
      <div class="note-title">${note.title}</div>
      <div class="note-preview">${note.content}</div>
      <div class="note-date">${formatDate(note.createdAt)}</div>
    `;

    item.onclick = () => loadNote(note.id);
    list.appendChild(item);
  });
}

function loadNote(id) {
  const note = notes.find((n) => n.id === id);
  activeNoteId = id;

  noteTitle.value = note.title;
  noteContent.value = note.content;
}

function deleteNotes() {
  if (!activeNoteId) {
    alert("Keine Notiz ausgewählt ⚠️");
    return;
  }

  notes = notes.filter((note) => note.id !== activeNoteId);
  normalizeIds();

  activeNoteId = null;

  document.getElementById("noteTitle").value = "";
  document.getElementById("noteContent").value = "";

  sortNotesByID();
  saveToLocalStorage();
  renderNotesList();
}

function saveToLocalStorage() {
  localStorage.setItem("notes", JSON.stringify(notes));
}
