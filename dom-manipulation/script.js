// ===== Initial Data =====
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt", category: "Inspiration" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James", category: "Motivation" },
];

// ===== DOM References =====
const appContainer = document.getElementById("app");

// ===== Populate Categories =====
function getCategories() {
  const categories = quotes.map(q => q.category);
  return [...new Set(categories)];
}

// ===== Display a Random Quote =====
function showRandomQuote(selectedCategory, displayArea) {
  const filtered = quotes.filter(q => q.category === selectedCategory);
  if (filtered.length === 0) {
    displayArea.innerHTML = "<p>No quotes for this category yet.</p>";
    return;
  }
  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  displayArea.innerHTML = `<blockquote>"${randomQuote.text}"</blockquote><p>- ${randomQuote.author}</p>`;
}

// ===== Create Add Quote Form =====
function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.innerHTML = `
    <h3>Add a New Quote</h3>
    <input type="text" id="new-quote-text" placeholder="Quote" /><br>
    <input type="text" id="new-quote-author" placeholder="Author" /><br>
    <input type="text" id="new-quote-category" placeholder="Category" /><br>
    <button id="add-quote-btn">Add Quote</button>
  `;
  appContainer.appendChild(formContainer);

  // Attach event listener for adding a new quote
  document.getElementById("add-quote-btn").addEventListener("click", () => {
    const text = document.getElementById("new-quote-text").value.trim();
    const author = document.getElementById("new-quote-author").value.trim();
    const category = document.getElementById("new-quote-category").value.trim();

    if (!text || !author || !category) {
      alert("Please fill out all fields.");
      return;
    }

    // ✅ Create newQuote object
    const newQuote = {
      text: text,
      author: author,
      category: category
    };

    // ✅ Push it to the array
    quotes.push(newQuote);
    alert("Quote added!");

    // Optionally reset form fields
    document.getElementById("new-quote-text").value = "";
    document.getElementById("new-quote-author").value = "";
    document.getElementById("new-quote-category").value = "";

    // Optionally re-render category dropdown if new category was added
  });
}


// ===== Create Category Dropdown & Display Button =====
function createCategorySelector() {
  const selectContainer = document.createElement("div");
  const categorySelect = document.createElement("select");
  categorySelect.id = "category-select";

  getCategories().forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  const displayArea = document.createElement("div");
  displayArea.id = "quote-display";

  const showBtn = document.createElement("button");
  showBtn.textContent = "Show Random Quote";
  showBtn.addEventListener("click", () => {
    const selectedCategory = categorySelect.value;
    showRandomQuote(selectedCategory, displayArea);
  });

  selectContainer.appendChild(categorySelect);
  selectContainer.appendChild(showBtn);
  appContainer.appendChild(selectContainer);
  appContainer.appendChild(displayArea);
}

// ===== Initialize App =====
function initApp() {
  createCategorySelector();
  createAddQuoteForm();
}

initApp();
