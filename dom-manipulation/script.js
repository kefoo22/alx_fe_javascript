let quotes = [];

// Load quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "Stay hungry, stay foolish.", author: "Steve Jobs", category: "Motivation" },
      { text: "Imagination is more important than knowledge.", author: "Albert Einstein", category: "Inspiration" }
    ];
    saveQuotes();
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show random quote
function showRandomQuote() {
  if (quotes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  document.getElementById("quoteDisplay").innerHTML = `
    <p>"${quote.text}"</p>
    <p><strong>- ${quote.author}</strong> [${quote.category}]</p>
  `;

  // Save last viewed quote index to sessionStorage
  sessionStorage.setItem("lastViewedQuoteIndex", randomIndex);
}

// Create form for adding new quotes
function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.innerHTML = `
    <h3>Add a New Quote</h3>
    <input type="text" id="new-quote-text" placeholder="Quote" /><br>
    <input type="text" id="new-quote-author" placeholder="Author" /><br>
    <input type="text" id="new-quote-category" placeholder="Category" /><br>
    <button id="addQuoteNow">Add Quote</button>
  `;
  document.getElementById("app").appendChild(formContainer);

  document.getElementById("addQuoteNow").addEventListener("click", () => {
    const text = document.getElementById("new-quote-text").value.trim();
    const author = document.getElementById("new-quote-author").value.trim();
    const category = document.getElementById("new-quote-category").value.trim();

    if (!text || !author || !category) {
      alert("Please fill out all fields.");
      return;
    }

    const newQuote = { text, author, category };
    quotes.push(newQuote);
    saveQuotes();
    alert("Quote added!");
  });
}

// Export quotes to JSON file
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "quotes.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Failed to import: " + err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listeners
document.getElementById("randomQuoteBtn").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", createAddQuoteForm);
document.getElementById("exportBtn").addEventListener("click", exportQuotes);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

// Initialize on load
loadQuotes();
