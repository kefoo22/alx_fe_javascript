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
  populateCategories();
}

// Populate category dropdown dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  // Remove old options
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore saved filter from localStorage
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    categoryFilter.value = savedFilter;
    filterQuotes();
  }
}

// Show random quote (within selected filter)
function showRandomQuote() {
  let filteredQuotes = quotes;
  const selectedCategory = document.getElementById("categoryFilter").value;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "<p>No quotes in this category.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  document.getElementById("quoteDisplay").innerHTML = `
    <p>"${quote.text}"</p>
    <p><strong>- ${quote.author}</strong> [${quote.category}]</p>
  `;

  sessionStorage.setItem("lastViewedQuoteIndex", randomIndex);
}

// Filter quotes by selected category and display all matching
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);

  const display = document.getElementById("quoteDisplay");
  display.innerHTML = "";

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    display.innerHTML = "<p>No quotes found in this category.</p>";
    return;
  }

  filteredQuotes.forEach(quote => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p>"${quote.text}"</p>
      <p><strong>- ${quote.author}</strong> [${quote.category}]</p>
    `;
    display.appendChild(div);
  });
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
    filterQuotes();
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
        filterQuotes();
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
populateCategories();
filterQuotes();
