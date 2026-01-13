// ============ variablen Deklaration ============
let notes = [];
let activeNoteId = null;

// ============ Hilfsfunktion Zeitstempel ============
function formatDate(date) {
  return new Date(date).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ============ 1. Notizen aus dem lokalen Speicher laden ============
document.addEventListener("DOMContentLoaded", () => {
  const savedNotes = localStorage.getItem("notes");

  if (savedNotes) {
    const parsedNotes = JSON.parse(savedNotes);

    // Prüfen, ob es ein Array ist
    if (Array.isArray(parsedNotes)) {
      notes = parsedNotes;
    } else {
      notes = []; // falls es kein Array ist, leeres Array verwenden
    }
    renderNotesList();
  }
});

// ============ 2. Neue Notit erstellen ============
function NewNote() {
  activeNoteId = null;
  document.getElementById("noteTitle").value = "";
  document.getElementById("noteContent").value = "";
}

// ============ 3. Notiz speichern ============
function SaveNotes() {
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
      id: Date.now(),
      title,
      content,
      createdAt: new Date(),
    };
    notes.push(newNote);
    activeNoteId = newNote.id;
  }

  saveToLocalStorage();
  renderNotesList();
  NewNote();
}

// ============ 4. Sidebar neu rendern ============
function renderNotesList() {
  const list = document.getElementById("sidebarNotesList");
  list.innerHTML = "";

  if (notes.length === 0) {
    list.innerHTML = `<p class="empty-message">Keine Notizen vorhanden</p>`;
    return;
  }

  notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  notes.forEach((note) => {
    const item = document.createElement("div");
    item.className = "note-item";

    const title = note.title;
    console.log(title);

    const PreviewTitle =
      title.length > 20 ? title.substring(0, 20) + "..." : title;
    console.log(title.length);

    const PreviewContent =
      note.content.length > 25
        ? note.content.substring(0, 25) + "..."
        : note.content;

    item.innerHTML = `
      <div class="note-title">${PreviewTitle}</div>
      <div class="note-preview">${PreviewContent}</div>
      <div class="note-date">${formatDate(note.createdAt)}</div>
    `;

    item.onclick = () => loadNote(note.id);
    list.appendChild(item);
  });
}

// ============ 5. Notiz laden ============
function loadNote(id) {
  const note = notes.find((n) => n.id === id);
  activeNoteId = id;

  noteTitle.value = note.title;
  noteContent.value = note.content;
}

// ============ 6. Notiz löschen ============
function DeleteNotes() {
  if (!activeNoteId) {
    alert("Keine Notiz ausgewählt ⚠️");
    return;
  }

  notes = notes.filter((note) => note.id !== activeNoteId);
  activeNoteId = null;

  document.getElementById("noteTitle").value = "";
  document.getElementById("noteContent").value = "";

  saveToLocalStorage();
  renderNotesList();
}

// ============ 7. Lokalen Speicher verwalten ============
function saveToLocalStorage() {
  localStorage.setItem("notes", JSON.stringify(notes));
}
