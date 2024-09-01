document.addEventListener('DOMContentLoaded', () => {
	// Load quotes from local storage or use a default array
	const quotes = JSON.parse(localStorage.getItem('quotes')) || [
		{
			text: 'The best way to predict the future is to invent it.',
			category: 'Innovation',
		},
		{
			text: 'You miss 100% of the shots you don’t take.',
			category: 'Opportunity',
		},
		{
			text: 'The only limit to our realization of tomorrow is our doubts of today.',
			category: 'Motivation',
		},
	];

	// Define the server URL (mock API)
	const serverUrl = 'https://jsonplaceholder.typicode.com/posts'; // Example URL

	// Function to fetch quotes from the server
	async function fetchQuotesFromServer() {
		try {
			const response = await fetch(serverUrl);
			const data = await response.json();
			return data.map((item) => ({ text: item.title, category: item.body })); // Adapt as needed
		} catch (error) {
			console.error('Error fetching data from server:', error);
			return [];
		}
	}

	// Function to post local quotes to the server
	async function postToServer(quotes) {
		try {
			await fetch(serverUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(quotes),
			});
		} catch (error) {
			console.error('Error posting data to server:', error);
		}
	}

	// Sync local quotes with server quotes
	async function syncQuotes() {
		const serverQuotes = await fetchQuotesFromServer();
		const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

		// Conflict resolution: Server data takes precedence
		const updatedQuotes = serverQuotes;

		// Save updated quotes to local storage
		localStorage.setItem('quotes', JSON.stringify(updatedQuotes));
		quotes.length = 0;
		quotes.push(...updatedQuotes);

		// Update UI
		populateCategories();
		filterQuotes();
	}

	// Periodically fetch data from the server every 5 minutes (300000 ms)
	setInterval(syncQuotes, 300000);

	// Function to handle server updates and notify the user
	function handleServerUpdate() {
		const notification = document.getElementById('notification');
		notification.style.display = 'block';
		notification.innerText = 'Quotes synced with server!';
	}

	// Sync local data with server and notify users
	async function syncQuotes() {
		const serverQuotes = await fetchQuotesFromServer();
		const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

		// Simple conflict resolution: Server data takes precedence
		const updatedQuotes = serverQuotes;

		// Check if server data is different from local data
		if (JSON.stringify(updatedQuotes) !== JSON.stringify(localQuotes)) {
			handleServerUpdate();
			localStorage.setItem('quotes', JSON.stringify(updatedQuotes));
			quotes.length = 0;
			quotes.push(...updatedQuotes);

			// Update UI
			populateCategories();
			filterQuotes();
		}
	}

	// Function to display a random quote
	function showRandomQuote() {
		if (quotes.length === 0) {
			document.getElementById('quoteDisplay').innerText =
				'No quotes available.';
			return;
		}

		const randomIndex = Math.floor(Math.random() * quotes.length);
		const quote = quotes[randomIndex];
		document.getElementById(
			'quoteDisplay'
		).innerText = `"${quote.text}" - ${quote.category}`;
	}

	// Function to save quotes to local storage
	function saveQuotes() {
		localStorage.setItem('quotes', JSON.stringify(quotes));
	}

	// Function to display quotes based on a category filter
	function filterQuotes() {
		const selectedCategory = document.getElementById('categoryFilter').value;
		const filteredQuotes =
			selectedCategory === 'all'
				? quotes
				: quotes.filter((q) => q.category === selectedCategory);

		if (filteredQuotes.length === 0) {
			document.getElementById('quoteDisplay').innerText =
				'No quotes available.';
			return;
		}

		const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
		const quote = filteredQuotes[randomIndex];
		document.getElementById(
			'quoteDisplay'
		).innerText = `"${quote.text}" - ${quote.category}`;
	}

	// Function to populate categories dynamically in the dropdown
	function populateCategories() {
		const categoryFilter = document.getElementById('categoryFilter');
		const categories = new Set(quotes.map((q) => q.category));

		// Add 'All Categories' option
		categoryFilter.innerHTML = '<option value="all">All Categories</option>';

		// Add options for each category
		categories.forEach((category) => {
			const option = document.createElement('option');
			option.value = category;
			option.textContent = category;
			categoryFilter.appendChild(option);
		});

		// Restore last selected category from local storage
		const lastSelectedCategory =
			localStorage.getItem('lastSelectedCategory') || 'all';
		categoryFilter.value = lastSelectedCategory;
		filterQuotes();
	}

	// Function to add a new quote
	function createAddQuoteForm() {
		const newQuoteText = document.getElementById('newQuoteText').value.trim();
		const newQuoteCategory = document
			.getElementById('newQuoteCategory')
			.value.trim();

		if (newQuoteText === '' || newQuoteCategory === '') {
			alert('Please enter both quote text and category.');
			return;
		}

		quotes.push({ text: newQuoteText, category: newQuoteCategory });
		saveQuotes();
		populateCategories(); // Update categories dropdown
		document.getElementById('newQuoteText').value = '';
		document.getElementById('newQuoteCategory').value = '';
		alert('Quote added successfully!');
	}

	// Function to export quotes as a JSON file
	function exportQuotes() {
		const blob = new Blob([JSON.stringify(quotes, null, 2)], {
			type: 'application/json',
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'quotes.json';
		a.click();
		URL.revokeObjectURL(url);
	}

	// Function to import quotes from a JSON file
	function importFromJsonFile(event) {
		const fileReader = new FileReader();
		fileReader.onload = function (event) {
			try {
				const importedQuotes = JSON.parse(event.target.result);
				if (Array.isArray(importedQuotes)) {
					quotes.length = 0; // Clear existing quotes
					quotes.push(...importedQuotes);
					saveQuotes();
					populateCategories(); // Update categories dropdown
					filterQuotes();
					alert('Quotes imported successfully!');
				} else {
					alert('Invalid JSON format.');
				}
			} catch (error) {
				alert('Error parsing JSON file.');
			}
		};
		fileReader.readAsText(event.target.files[0]);
	}

	// Function to save the last selected category filter in local storage
	function saveLastSelectedCategory() {
		const selectedCategory = document.getElementById('categoryFilter').value;
		localStorage.setItem('lastSelectedCategory', selectedCategory);
	}

	// Event listeners
	document.getElementById('newQuote').addEventListener('click', filterQuotes);
	document
		.getElementById('exportQuotes')
		.addEventListener('click', exportQuotes);
	document.getElementById('categoryFilter').addEventListener('change', () => {
		filterQuotes();
		saveLastSelectedCategory();
	});

	// Initial quote display
	showRandomQuote();
	populateCategories();
	filterQuotes();
	syncQuotes();
});