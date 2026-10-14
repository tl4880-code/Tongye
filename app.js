const bookList = document.querySelector("#book-list");
const filters = document.querySelector("#filters");
const searchInput = document.querySelector("#search");
const statusMessage = document.querySelector("#status");
const emptyState = document.querySelector("#empty-state");
const bookCount = document.querySelector("#book-count");
const bookDialog = document.querySelector("#book-dialog");

let allBooks = [];
let visibleCollection = [];
let searchText = "";
let requestNumber = 0;

function renderBooks() {
  const term = searchText.toLowerCase();
  const results = visibleCollection.filter((book) => {
    const searchableText = `${book.title} ${book.author} ${book.genre}`.toLowerCase();
    return searchableText.includes(term);
  });

  const cards = results.map((book) => {
    const article = document.createElement("article");
    article.className = "book-card";

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.className = "book-author";
    author.textContent = `By ${book.author}`;

    const description = document.createElement("p");
    description.className = "book-description";
    description.textContent = book.description;

    const metadata = document.createElement("p");
    metadata.className = "book-metadata";
    metadata.textContent = `${book.genre} · ${book.year}`;

    const detailsButton = document.createElement("button");
    detailsButton.className = "details-button";
    detailsButton.type = "button";
    detailsButton.dataset.slug = book.slug;
    detailsButton.textContent = "View details";

    article.append(title, author, description, metadata, detailsButton);
    return article;
  });

  bookList.replaceChildren(...cards);
  bookCount.textContent = String(results.length);
  emptyState.hidden = results.length > 0;
  statusMessage.textContent = "";
}

function addGenreFilters(books) {
  const genres = [...new Set(books.map((book) => book.genre))].sort();

  for (const genre of genres) {
    const button = document.createElement("button");
    button.className = "filter";
    button.type = "button";
    button.dataset.genre = genre;
    button.textContent = genre;
    button.setAttribute("aria-pressed", "false");
    filters.append(button);
  }
}

async function loadBooks(genre = "all") {
  const thisRequest = ++requestNumber;
  const url = genre === "all" ? "/data" : `/data?genre=${encodeURIComponent(genre)}`;
  statusMessage.textContent = "Loading books…";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Could not load the books. Please refresh the page.");
    const result = await response.json();
    if (thisRequest !== requestNumber) return;
    visibleCollection = result;
    renderBooks();
  } catch (error) {
    if (thisRequest === requestNumber) statusMessage.textContent = error.message;
  }
}

filters.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-genre]");
  if (!button) return;

  for (const filter of filters.querySelectorAll(".filter")) {
    const selected = filter === button;
    filter.classList.toggle("is-active", selected);
    filter.setAttribute("aria-pressed", String(selected));
  }

  loadBooks(button.dataset.genre);
});

searchInput.addEventListener("input", () => {
  searchText = searchInput.value.trim();
  renderBooks();
});

bookList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-slug]");
  if (!button) return;

  try {
    // Request one book through the path-parameter route.
    const response = await fetch(`/data/${encodeURIComponent(button.dataset.slug)}`);
    if (!response.ok) throw new Error("Could not find this book.");
    const book = await response.json();

    document.querySelector("#dialog-genre").textContent = book.genre;
    document.querySelector("#dialog-title").textContent = book.title;
    document.querySelector("#dialog-author").textContent = `By ${book.author}`;
    document.querySelector("#dialog-description").textContent = book.description;
    document.querySelector("#dialog-year").textContent = `Published ${book.year}`;
    bookDialog.showModal();
  } catch (error) {
    statusMessage.textContent = error.message;
  }
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    searchInput.value = "";
    searchText = "";
    renderBooks();
  }
});

async function start() {
  try {
    // Bonus: fetch the JSON data and add it to the static homepage.
    const response = await fetch("/data");
    if (!response.ok) throw new Error("Could not load the books. Please refresh the page.");

    allBooks = await response.json();
    visibleCollection = allBooks;
    addGenreFilters(allBooks);
    renderBooks();
  } catch (error) {
    statusMessage.textContent = error.message;
  }
}

start();
