// ============ 1. DOM-ELEMENTE REFERENZIEREN ============
// Das sind die Verbindungen zu den HTML-Elementen
const titleInput = document.getElementById("titleInput");
const contentInput = document.getElementById("contentInput");
const addBtn = document.getElementById("addBtn");
const sidebarNotesList = document.getElementById("sidebarNotesList");
const selectedNoteDetail = document.getElementById("selectedNoteDetail");
const selectedNoteContent = document.getElementById("selectedNoteContent");

// ============ 2. DATENSPEICHER (Array für Notizen) ============
// Hier speichern wir alle Notizen im RAM (und später im localStorage)
let notes = [];
let selectedNoteId = null; // Speichert, welche Notiz ausgewählt ist

// ============ 3. BEIM LADEN: NOTIZEN AUS LOCALSTORAGE LADEN ============
document.addEventListener("DOMContentLoaded", () => {
  loadNotes(); // Notizen aus localStorage laden
  renderNotes(); // Notizen auf der Seite anzeigen
});

// ============ 4. BUTTON-KLICK: NEUE NOTIZ HINZUFÜGEN ============
addBtn.addEventListener("click", addNote);

function addNote() {
  // Schritt A: Werte aus Eingabefeldern auslesen
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  // Schritt B: Prüfen, ob mindestens etwas eingegeben wurde
  if (!title && !content) {
    alert("Bitte gib einen Titel oder Inhalt ein!");
    return;
  }

  // Schritt C: Neue Notiz-Objekt erstellen
  const newNote = {
    id: Date.now(), // Eindeutige ID (Zeitstempel)
    title: title || "Ohne Titel", // Fallback, falls kein Titel
    content: content,
    createdAt: new Date().toLocaleString("de-DE"), // Zeitstempel (deutsches Format)
  };

  // Schritt D: Notiz zum Array hinzufügen (am Anfang = unshift)
  notes.unshift(newNote);

  // Schritt E: In localStorage speichern
  saveNotes();

  // Schritt F: Eingabefelder leeren
  titleInput.value = "";
  contentInput.value = "";
  titleInput.focus();

  // Schritt G: Neue Notiz automatisch auswählen
  selectedNoteId = newNote.id;
  renderNotes();
  renderSelectedNote();
}

// ============ 5. NOTIZ AUSWÄHLEN (KLICK AUF SIDEBAR) ============
function selectNote(id) {
  selectedNoteId = id;
  renderNotes(); // Sidebar aktualisieren (markiert ausgewählte Notiz)
  renderSelectedNote(); // Detailbereich anzeigen
}

// ============ 6. SIDEBAR RENDERN ============
function renderNotes() {
  // Sidebar-Liste rendern
  if (notes.length === 0) {
    sidebarNotesList.innerHTML =
      '<p class="empty-message">Keine Notizen vorhanden</p>';
  } else {
    sidebarNotesList.innerHTML = notes
      .map(
        (note) => `
        <div 
          class="note-item ${selectedNoteId === note.id ? "active" : ""}" 
          data-id="${note.id}"
          onclick="selectNote(${note.id})"
          style="cursor: pointer;"
        >
          <h4>${escapeHtml(note.title)}</h4>
          <p class="note-preview">${escapeHtml(truncate(note.content, 50))}</p>
          <p class="note-date">${note.createdAt}</p>
          <button 
            class="btn-delete" 
            onclick="deleteNote(${note.id}, event)"
            style="width: 100%; margin-top: 0.5rem;"
          >
            🗑️ Löschen
          </button>
        </div>
      `
      )
      .join("");
  }
}

// ============ 7. DETAILBEREICH RENDERN (AUSGEWÄHLTE NOTIZ) ============
function renderSelectedNote() {
  if (!selectedNoteId) {
    selectedNoteDetail.style.display = "none";
    return;
  }

  const note = notes.find((n) => n.id === selectedNoteId);

  if (!note) {
    selectedNoteDetail.style.display = "none";
    return;
  }

  selectedNoteDetail.style.display = "block";
  selectedNoteContent.innerHTML = `
    <div class="note-card">
      <h2>${escapeHtml(note.title)}</h2>
      <p class="note-date">📅 ${note.createdAt}</p>
      <p class="note-text">${escapeHtml(note.content).replace(
        /\n/g,
        "<br>"
      )}</p>
      <button 
        class="btn-edit" 
        onclick="editNote(${note.id})"
        style="margin-right: 0.5rem;"
      >
        ✏️ Bearbeiten
      </button>
      <button 
        class="btn-delete" 
        onclick="deleteNote(${note.id}, event)"
      >
        🗑️ Löschen
      </button>
    </div>
  `;
}

// ============ 8. NOTIZ LÖSCHEN ============
function deleteNote(id, event) {
  event.stopPropagation(); // Verhindert, dass Klick nach oben bubbled

  // Sicherheitsabfrage
  if (!confirm("Soll diese Notiz wirklich gelöscht werden?")) {
    return;
  }

  // Notiz aus Array filtern (entfernen)
  notes = notes.filter((note) => note.id !== id);

  // localStorage aktualisieren
  saveNotes();

  // Wenn gelöschte Notiz ausgewählt war: Auswahl löschen
  if (selectedNoteId === id) {
    selectedNoteId = null;
    selectedNoteDetail.style.display = "none";
  }

  // Anzeige aktualisieren
  renderNotes();
  renderSelectedNote();
}

// ============ 9. NOTIZ BEARBEITEN (STUB) ============
function editNote(id) {
  // Zum jetzt nur als Platzhalter — später kann man ein Modal hinzufügen
  alert("Bearbeiten-Funktion noch nicht implementiert");
  // Später: Modal öffnen, Felder füllen, speichern
}

// ============ 10. LOCALSTORAGE: SPEICHERN ============
function saveNotes() {
  // Array als JSON-String speichern
  localStorage.setItem("myNotes", JSON.stringify(notes));
  console.log("Notizen gespeichert:", notes);
}

// ============ 11. LOCALSTORAGE: LADEN ============
function loadNotes() {
  // Daten aus localStorage holen
  const savedNotes = localStorage.getItem("myNotes");

  // Wenn Daten vorhanden: parsen und laden
  if (savedNotes) {
    notes = JSON.parse(savedNotes);
  } else {
    notes = []; // Sonst leeres Array
  }
  console.log("Notizen geladen:", notes);
}

// ============ 12. HILFSFUNKTIONEN ============
// Text abkürzen (z.B. "Das ist eine lange Not..." statt voller Text)
function truncate(text, maxLength) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
}

// HTML-Zeichen escapen (Sicherheit: verhindert HTML-Injection)
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
