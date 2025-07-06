// ===== Initial Data Structure =====
let quotes = [
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "Inspiration" },
  { text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", author: "Buddha", category: "Mindfulness" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "Success" }
];

// ===== DOM References =====
const categorySelect = document.getElementById("category-select");
const showQuoteBtn = document.getElementById("show-quote-btn");
const quoteDisplay = document.getElementById("quote-display");
const addCategoryInput = document.getElementById("add-category-input");
const addCategoryBtn = document.getElementById("add-category-btn");

const newQuoteInput = document.getElementById("new-quote-input");
const newAuthorInput = document.getElementById("new-author-input");
const newCategoryInput = document.getElementById("new-category-input");
const addQuoteBtn = document.getElementById("add-quote-btn");

// ===== Helper: Get Unique Categories =====
function getCategories() {
  const categories = quotes.map(q => q.category);
  return [...new Set(categories)];
}

// ===== Populate Category Dropdown =====
function populateCategories() {
  categorySelect.innerHTML = "";
  getCategories().forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.innerText = category;
    categorySelect.appendChild(option);
  });
}

// ===== Show a Random Quote =====
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes in this category yet.</p>";
    return;
  }
  
  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];

  quoteDisplay.innerHTML = `
    <blockquote>"${randomQuote.text}"</blockquote>
    <p>- ${randomQuote.author}</p>
  `;
}

// ===== Add New Quote =====
function addNewQuote() {
  const text = newQuoteInput.value.trim();
  const author = newAuthorInput.value.trim();
  const category = newCategoryInput.value.trim();

  if (!text || !author || !category) {
    alert("Please fill out all quote fields.");
    return;
  }

  quotes.push({ text, author, category });

  // Update dropdown if category is new
  if (!getCategories().includes(category)) {
    populateCategories();
  }

  // Clear input fields
  newQuoteInput.value = "";
  newAuthorInput.value = "";
  newCategoryInput.value = "";

  alert("New quote added successfully!");
}

// ===== Add New Category =====
function addNewCategory() {
  const newCategory = addCategoryInput.value.trim();
  if (!newCategory) {
    alert("Please enter a category name.");
    return;
  }

  if (getCategories().includes(newCategory)) {
    alert("Category already exists.");
    return;
  }

  // Add dummy quote to establish category
  quotes.push({ text: "Placeholder quote for category.", author: "System", category: newCategory });

  populateCategories();
  addCategoryInput.value = "";

  alert("New category added!");
}

// ===== Event Listeners =====
showQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addNewQuote);
addCategoryBtn.addEventListener("click", addNewCategory);

// ===== Initialize Page =====
populateCategories();
