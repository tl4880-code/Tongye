const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Each book has at least three key-value pairs, as required by the assignment.
const books = [
  { slug: "the-hobbit", title: "The Hobbit", author: "J. R. R. Tolkien", genre: "Fantasy", year: 1937, description: "Bilbo Baggins leaves home for an unexpected adventure." },
  { slug: "a-wizard-of-earthsea", title: "A Wizard of Earthsea", author: "Ursula K. Le Guin", genre: "Fantasy", year: 1968, description: "A young wizard learns the cost and responsibility of power." },
  { slug: "piranesi", title: "Piranesi", author: "Susanna Clarke", genre: "Fantasy", year: 2020, description: "A solitary man explores a mysterious house filled with statues and tides." },
  { slug: "the-night-circus", title: "The Night Circus", author: "Erin Morgenstern", genre: "Fantasy", year: 2011, description: "Two magicians compete inside a circus that opens only at night." },
  { slug: "kindred", title: "Kindred", author: "Octavia E. Butler", genre: "Science Fiction", year: 1979, description: "A modern woman is repeatedly pulled into the past of her family." },
  { slug: "the-left-hand-of-darkness", title: "The Left Hand of Darkness", author: "Ursula K. Le Guin", genre: "Science Fiction", year: 1969, description: "A diplomat travels to a distant planet with an unfamiliar society." },
  { slug: "the-martian", title: "The Martian", author: "Andy Weir", genre: "Science Fiction", year: 2011, description: "An astronaut uses science and ingenuity to survive alone on Mars." },
  { slug: "braiding-sweetgrass", title: "Braiding Sweetgrass", author: "Robin Wall Kimmerer", genre: "Essays", year: 2013, description: "Botany and Indigenous knowledge offer new ways to care for nature." },
  { slug: "the-book-of-delights", title: "The Book of Delights", author: "Ross Gay", genre: "Essays", year: 2019, description: "Short essays find joy in small moments of everyday life." },
  { slug: "crying-in-h-mart", title: "Crying in H Mart", author: "Michelle Zauner", genre: "Memoir", year: 2021, description: "A musician writes about grief, family, and food." },
  { slug: "pride-and-prejudice", title: "Pride and Prejudice", author: "Jane Austen", genre: "Classic", year: 1813, description: "Elizabeth Bennet and Mr. Darcy learn to look beyond first impressions." },
  { slug: "the-housekeeper-and-the-professor", title: "The Housekeeper and the Professor", author: "Yoko Ogawa", genre: "Fiction", year: 2003, description: "A housekeeper and her son connect with a professor whose memory lasts only eighty minutes." }
];

// Route 1: serve the static homepage.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Serve the homepage assets without exposing the rest of the project folder.
app.get("/app.js", (req, res) => {
  res.sendFile(path.join(__dirname, "app.js"));
});

app.get("/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "styles.css"));
});

// Route 2: return all books, or filter by the optional genre query parameter.
app.get("/data", (req, res) => {
  const genre = req.query.genre;
  const result = genre
    ? books.filter((book) => book.genre.toLowerCase() === String(genre).toLowerCase())
    : books;

  res.json(result);
});

// Route 3: return only the book that matches the path parameter.
app.get("/data/:slug", (req, res) => {
  const book = books.find((item) => item.slug === req.params.slug);

  if (!book) {
    return res.status(404).json({ error: "Book not found", slug: req.params.slug });
  }

  res.json(book);
});

app.listen(PORT, "127.0.0.1", () => {
  console.log("App is running at http://localhost:" + PORT);
});
