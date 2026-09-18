// server.js
const express = require("express");
const cors = require("cors");
const booksRouter = require("./routes/books");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mount the books router
app.use("/api/books", booksRouter);

// Root route — simple health check / welcome message
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Nairobi Library System API",
    endpoints: {
      "GET /api/books": "List all books (supports ?genre, ?available, ?search, ?page, ?limit, ?sort, ?order)",
      "GET /api/books/:id": "Get a single book",
      "POST /api/books": "Create a new book",
      "PUT /api/books/:id": "Full update of a book",
      "DELETE /api/books/:id": "Delete a book (must not be borrowed)",
      "POST /api/books/:id/borrow": "Borrow a book (body: { borrower })",
      "POST /api/books/:id/return": "Return a borrowed book",
    },
  });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// Generic error handler (e.g. malformed JSON bodies)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`📚 Library API running at http://localhost:${PORT}`);
});
