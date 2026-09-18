// routes/books.js
const express = require("express");
const router = express.Router();
const { validateNewBook, validateFullUpdate, validateBorrow } = require("../middleware/validate");

// In-memory data store
let books = [
  { id: 1, title: "Weep Not, Child", author: "Ngugi wa Thiong'o", isbn: "978-0-14-018650-2", genre: "fiction", available: true, borrowedBy: null },
  { id: 2, title: "The River Between", author: "Ngugi wa Thiong'o", isbn: "978-0-14-018651-9", genre: "fiction", available: false, borrowedBy: "Amina Wanjiku" },
  { id: 3, title: "Born a Crime", author: "Trevor Noah", isbn: "978-0-399-59043-2", genre: "autobiography", available: true, borrowedBy: null },
  { id: 4, title: "Americanah", author: "Chimamanda Ngozi Adichie", isbn: "978-0-307-45592-8", genre: "fiction", available: true, borrowedBy: null },
  { id: 5, title: "The Lean Startup", author: "Eric Ries", isbn: "978-0-307-88789-4", genre: "business", available: false, borrowedBy: "Brian Ochieng" },
  { id: 6, title: "Clean Code", author: "Robert C. Martin", isbn: "978-0-13-235088-4", genre: "technology", available: true, borrowedBy: null },
  { id: 7, title: "Dust", author: "Yvonne Adhiambo Owuor", isbn: "978-1-78470-045-2", genre: "fiction", available: true, borrowedBy: null },
  { id: 8, title: "Half of a Yellow Sun", author: "Chimamanda Ngozi Adichie", isbn: "978-1-4000-9520-3", genre: "fiction", available: true, borrowedBy: null },
];

let nextId = books.length + 1;

// Helper: find a book's index by id (numeric)
function findBookIndex(id) {
  const numericId = Number(id);
  return books.findIndex((b) => b.id === numericId);
}

// TASK 1: Read endpoints with filtering, search, and (bonus) pagination/sort
// GET /api/books
router.get("/", (req, res) => {
  let result = [...books];

  const { genre, available, search, sort, order, page, limit } = req.query;

  // Filter by genre
  if (genre) {
    result = result.filter((b) => b.genre.toLowerCase() === genre.toLowerCase());
  }

  // Filter by availability
  if (available !== undefined) {
    const isAvailable = available === "true";
    result = result.filter((b) => b.available === isAvailable);
  }

  // Search title and author (case-insensitive)
  if (search) {
    const term = search.toLowerCase();
    result = result.filter(
      (b) => b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term)
    );
  }

  // BONUS: sorting
  if (sort) {
    const sortField = sort;
    const sortOrder = order === "desc" ? -1 : 1;

    if (sortField === "title" || sortField === "author") {
      result.sort((a, b) => {
        const valA = a[sortField].toLowerCase();
        const valB = b[sortField].toLowerCase();
        if (valA < valB) return -1 * sortOrder;
        if (valA > valB) return 1 * sortOrder;
        return 0;
      });
    }
  }

  // BONUS: pagination
  if (page || limit) {
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || result.length, 1);
    const total = result.length;
    const totalPages = Math.ceil(total / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = result.slice(startIndex, startIndex + limitNum);

    return res.json({
      success: true,
      count: paginated.length,
      data: paginated,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    });
  }

  res.json({
    success: true,
    count: result.length,
    data: result,
  });
});

// TASK 2: Single read
// GET /api/books/:id
router.get("/:id", (req, res) => {
  const index = findBookIndex(req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: "Book not found" });
  }

  res.json({ success: true, data: books[index] });
});

// TASK 2: Create
// POST /api/books
router.post("/", validateNewBook, (req, res) => {
  const { title, author, isbn, genre } = req.body;

  const newBook = {
    id: nextId++,
    title,
    author,
    isbn,
    genre,
    available: true,
    borrowedBy: null,
  };

  books.push(newBook);
  res.status(201).json({ success: true, data: newBook });
});


// TASK 2: Full update
// PUT /api/books/:id
router.put("/:id", validateFullUpdate, (req, res) => {
  const index = findBookIndex(req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: "Book not found" });
  }

  const { title, author, isbn, genre, available, borrowedBy } = req.body;

  books[index] = {
    ...books[index],
    title,
    author,
    isbn,
    genre,
    available,
    borrowedBy,
  };

  res.json({ success: true, data: books[index] });
});

// TASK 2: Delete
// DELETE /api/books/:id
router.delete("/:id", (req, res) => {
  const index = findBookIndex(req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: "Book not found" });
  }

  if (books[index].available === false) {
    return res.status(400).json({
      success: false,
      error: "Cannot delete a book that is currently borrowed",
    });
  }

  const [deleted] = books.splice(index, 1);
  res.status(200).json({ success: true, data: deleted });
});

// TASK 3: Borrow a book
// POST /api/books/:id/borrow
router.post("/:id/borrow", validateBorrow, (req, res) => {
  const index = findBookIndex(req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: "Book not found" });
  }

  const book = books[index];

  if (book.available === false) {
    return res.status(400).json({
      success: false,
      error: `Book is already borrowed by ${book.borrowedBy}`,
    });
  }

  book.available = false;
  book.borrowedBy = req.body.borrower;

  res.json({ success: true, data: book });
});

// TASK 3: Return a book
// POST /api/books/:id/return
router.post("/:id/return", (req, res) => {
  const index = findBookIndex(req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: "Book not found" });
  }

  const book = books[index];

  if (book.available === true) {
    return res.status(400).json({
      success: false,
      error: "Book is not currently borrowed",
    });
  }

  book.available = true;
  book.borrowedBy = null;

  res.json({ success: true, data: book });
});

module.exports = router;
