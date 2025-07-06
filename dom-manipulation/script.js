// Dynamic Quote Generator - Full Script

const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // mock server endpoint
let quotes = [];

// Load quotes from localStorage
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  if (stored) {
    quotes = JSON.parse(stored);
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
  displayQuotes();
  populateCategories();
}

// Display quotes to UI
function displayQuotes() {
  const container = document.getElementById('quoteContainer');
  container.innerHTML = '';
  const categoryFilter = localStorage.getItem('selectedCategory') || 'all';

  quotes.forEach(quote => {
    if (categoryFilter === 'all' || quote.category === categoryFilter) {
      const div = document.createElement('div');
      div.className = 'quote';

      div.innerHTML = `
        <p>"${quote.text}" - ${quote.author} [${quote.category}]</p>
        <button onclick="removeQuote(${quote.id})">Remove</button>
      `;
      container.appendChild(div);
    }
  });
}

// Populate category filter dropdown
function populateCategories() {
  const select = document.getElementById('categoryFilter');
  const categories = ['all', ...new Set(quotes.map(q => q.category))];
  select.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');
  select.value = localStorage.getItem('selectedCategory') || 'all';
}

// Filter quotes based on category
function filterQuotes() {
  const selected = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selected);
  displayQuotes();
}

// Add a new quote
function addQuote() {
  const text = document.getElementById('quoteText').value.trim();
  const author = document.getElementById('quoteAuthor').value.trim();
  const category = document.getElementById('quoteCategory').value.trim();

  if (text && author && category) {
    const newQuote = {
      id: Date.now(),
      text,
      author,
      category
    };
    quotes.push(newQuote);
    saveQuotes();
    syncLocalChanges();

    document.getElementById('quoteText').value = '';
    document.getElementById('quoteAuthor').value = '';
    document.getElementById('quoteCategory').value = '';
  } else {
    alert('Please fill in all fields.');
  }
}

// Remove quote by ID
function removeQuote(id) {
  quotes = quotes.filter(q => q.id !== id);
  saveQuotes();
  syncLocalChanges();
}

// Export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
      syncLocalChanges();
    } catch (err) {
      alert('Invalid JSON file.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Fetch server quotes and merge (server takes precedence)
async function fetchServerQuotes() {
  try {
    const res = await fetch(SERVER_URL);
    const serverQuotes = await res.json();

    // simulate server data format
    const serverData = serverQuotes.slice(0, 5).map(q => ({
      id: q.id,
      text: q.title,
      author: 'Server Author',
      category: 'Server'
    }));

    const map = new Map();
    quotes.forEach(q => map.set(q.id, q));
    serverData.forEach(q => map.set(q.id, q));

    quotes = Array.from(map.values());
    saveQuotes();
    showNotification("Synced with server");
  } catch (error) {
    console.error("Error syncing with server:", error);
  }
}

// Push local quotes to server (simulation)
async function syncLocalChanges() {
  try {
    await fetch(SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quotes)
    });
    console.log("Local changes pushed to server.");
  } catch (err) {
    console.error("Failed to push local changes", err);
  }
}

// Periodic sync setup
function setupSync() {
  fetchServerQuotes();
  setInterval(fetchServerQuotes, 60000); // every 60 seconds
}

// Show temporary notification
function showNotification(message) {
  let banner = document.getElementById('sync-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'sync-banner';
    banner.style = 'position:fixed;top:0;left:0;right:0;background:#ffc;padding:10px;text-align:center;';
    document.body.appendChild(banner);
  }
  banner.textContent = message;
  setTimeout(() => banner.remove(), 5000);
}

// Initialize on load
window.onload = () => {
  loadQuotes();
  displayQuotes();
  populateCategories();
  setupSync();
};
