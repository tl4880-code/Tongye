const bookList = document.querySelector("#book-list");
const filters = document.querySelector("#filters");
const statusMessage = document.querySelector("#status");
const emptyState = document.querySelector("#empty-state");
const bookCount = document.querySelector("#book-count");
const bookDialog = document.querySelector("#book-dialog");

let visibleBooks = [];
let requestNumber = 0;

const genreEmojis = {
  Classic: "🌼",
  Essays: "🍃",
  Fantasy: "✨",
  Fiction: "📚",
  Memoir: "💌",
  "Science Fiction": "🌙"
};

function renderBooks() {
  const cards = visibleBooks.map((book) => {
    const article = document.createElement("article");
    article.className = "book-card";

    const top = document.createElement("div");
    top.className = "book-card-top";

    const icon = document.createElement("span");
    icon.className = "book-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = genreEmojis[book.genre] || "📖";

    const heading = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.className = "book-author";
    author.textContent = "By " + book.author;
    heading.append(title, author);
    top.append(icon, heading);

    const description = document.createElement("p");
    description.className = "book-description";
    description.textContent = book.description;

    const metadata = document.createElement("div");
    metadata.className = "book-meta";
    const genre = document.createElement("span");
    genre.className = "book-genre";
    genre.textContent = book.genre;
    const year = document.createElement("span");
    year.className = "book-year";
    year.textContent = book.year;
    metadata.append(genre, year);

    const detailsButton = document.createElement("button");
    detailsButton.className = "details-button";
    detailsButton.type = "button";
    detailsButton.dataset.slug = book.slug;
    detailsButton.textContent = "Peek inside";

    article.append(top, description, metadata, detailsButton);
    return article;
  });

  bookList.replaceChildren(...cards);
  bookCount.textContent = visibleBooks.length + " books";
  emptyState.hidden = visibleBooks.length > 0;
}

function addGenreFilters(books) {
  const genres = [...new Set(books.map((book) => book.genre))].sort();

  for (const genre of genres) {
    const button = document.createElement("button");
    button.className = "filter";
    button.type = "button";
    button.dataset.genre = genre;
    button.textContent = (genreEmojis[genre] || "📖") + " " + genre;
    button.setAttribute("aria-pressed", "false");
    filters.append(button);
  }
}

async function loadBooks(genre = "all") {
  const thisRequest = ++requestNumber;
  const url = genre === "all" ? "/data" : "/data?genre=" + encodeURIComponent(genre);
  statusMessage.hidden = false;
  statusMessage.textContent = "Finding your books…";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Could not load the books. Please refresh the page.");
    const result = await response.json();
    if (thisRequest !== requestNumber) return;
    visibleBooks = result;
    renderBooks();
    statusMessage.hidden = true;
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

bookList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-slug]");
  if (!button) return;

  try {
    // Use the path-parameter route to request one book at a time.
    const response = await fetch("/data/" + encodeURIComponent(button.dataset.slug));
    if (!response.ok) throw new Error("Could not find this book.");
    const book = await response.json();

    document.querySelector("#dialog-genre").textContent = book.genre;
    document.querySelector("#dialog-title").textContent = book.title;
    document.querySelector("#dialog-author").textContent = "By " + book.author;
    document.querySelector("#dialog-description").textContent = book.description;
    document.querySelector("#dialog-year").textContent = "Published " + book.year;
    bookDialog.showModal();
  } catch (error) {
    statusMessage.hidden = false;
    statusMessage.textContent = error.message;
  }
});

async function start() {
  try {
    // Bonus: fetch the JSON data and add it to the static homepage.
    const response = await fetch("/data");
    if (!response.ok) throw new Error("Could not load the books. Please refresh the page.");

    const books = await response.json();
    addGenreFilters(books);
    visibleBooks = books;
    renderBooks();
    statusMessage.hidden = true;
  } catch (error) {
    statusMessage.textContent = error.message;
  }
}

start();
