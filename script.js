let quotes = [
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Inspiration" },
  { text: "The way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Your time is limited, so don't waste it living someone else's life.", category: "Life" }
];


// Function to display a random quote
function showRandomQuote() {
const quoteDisplay = document.getElementById('quoteDisplay');
if (quotes.length === 0) {
  quoteDisplay.innerHTML = 'No quotes available';
  return;
}
const randomIndex = Math.floor(Math.random() * quotes.length);
const quote = quotes[randomIndex];
quoteDisplay.innerHTML = `<p>${quote.text} - <em>${quote.category}</em></p>`;
}

// Function to add a new quote
function addQuote() {
const newQuoteText = document.getElementById('newQuoteText').value;
const newQuoteCategory = document.getElementById('newQuoteCategory').value;

if (newQuoteText === '' || newQuoteCategory === '') {
  alert('Please enter both quote text and category');
  return;
}

const newQuote = { text: newQuoteText, category: newQuoteCategory };
quotes.push(newQuote);
saveQuotes();
populateCategories();
alert('Quote added successfully!');
}

// Function to save quotes to local storage
function saveQuotes() {
localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotes() {
const savedQuotes = localStorage.getItem('quotes');
if (savedQuotes) {
  quotes = JSON.parse(savedQuotes);
}
}


// Function to populate categories in the filter dropdown
function populateCategories() {
const categories = [...new Set(quotes.map(quote => quote.category))];
const categoryFilter = document.getElementById('categoryFilter');
categoryFilter.innerHTML = '<option value="all">All Categories</option>';
categories.forEach(category => {
  const option = document.createElement('option');
  option.value = category;
  option.textContent = category;
  categoryFilter.appendChild(option);
});
}

// Function to filter quotes based on selected category
function filterQuotes() {
const selectedCategory = document.getElementById('categoryFilter').value;
const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
const quoteDisplay = document.getElementById('quoteDisplay');
quoteDisplay.innerHTML = '';
filteredQuotes.forEach(quote => {
  const quoteElement = document.createElement('p');
  quoteElement.innerHTML = `${quote.text} - <em>${quote.category}</em>`;
  quoteDisplay.appendChild(quoteElement);
});
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
const dataStr = JSON.stringify(quotes, null, 2);
const dataBlob = new Blob([dataStr], { type: 'application/json' });
const url = URL.createObjectURL(dataBlob);
const a = document.createElement('a');
a.href = url;
a.download = 'quotes.json';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
}



function importFromJsonFile(event) {
const fileReader = new FileReader();
fileReader.onload = function(event) {
  try {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert('Quotes imported successfully!');
  } catch (e) {
    console.error('Error importing quotes:', e);
    alert('Error importing quotes. Please ensure the file is a valid JSON.');
  }
};
fileReader.readAsText(event.target.files[0]);
}
// Initialize the application
function init() {
loadQuotes();
populateCategories();
showRandomQuote();
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
}

window.onload = init;