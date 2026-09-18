// middleware/validate.js
// Validation helpers and middleware for the library API

const REQUIRED_FIELDS = ["title", "author", "isbn", "genre"];

/**
 * Basic ISBN sanity check.
 * Rule (per assignment spec): must contain only digits and dashes,
 * and be at least 10 characters long.
 */
function isValidISBN(isbn) {
  if (typeof isbn !== "string") return false;
  const isbnPattern = /^[0-9-]+$/;
  return isbn.length >= 10 && isbnPattern.test(isbn);
}

/**
 * Validates the body for POST /api/books (creating a new book).
 * Required fields: title, author, isbn, genre.
 */
function validateNewBook(req, res, next) {
  const body = req.body || {};
  const missing = REQUIRED_FIELDS.filter(
    (field) => body[field] === undefined || body[field] === null || body[field] === ""
  );

  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      error: `Missing required field(s): ${missing.join(", ")}`,
    });
  }

  if (!isValidISBN(body.isbn)) {
    return res.status(400).json({
      success: false,
      error: "Invalid ISBN format. ISBN must contain only digits and dashes, and be at least 10 characters long.",
    });
  }

  next();
}

/**
 * Validates the body for PUT /api/books/:id (full update).
 * Per spec, ALL fields are required for a full update.
 */
function validateFullUpdate(req, res, next) {
  const body = req.body || {};
  const fullFields = ["title", "author", "isbn", "genre", "available", "borrowedBy"];
  const missing = fullFields.filter((field) => body[field] === undefined);

  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      error: `Missing required field(s) for full update: ${missing.join(", ")}`,
    });
  }

  if (typeof body.available !== "boolean") {
    return res.status(400).json({
      success: false,
      error: "'available' must be a boolean (true or false).",
    });
  }

  if (!isValidISBN(body.isbn)) {
    return res.status(400).json({
      success: false,
      error: "Invalid ISBN format. ISBN must contain only digits and dashes, and be at least 10 characters long.",
    });
  }

  next();
}

/**
 * Validates the body for POST /api/books/:id/borrow
 */
function validateBorrow(req, res, next) {
  const body = req.body || {};
  if (!body.borrower || typeof body.borrower !== "string" || body.borrower.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "'borrower' (name) is required to borrow a book.",
    });
  }
  next();
}

module.exports = {
  isValidISBN,
  validateNewBook,
  validateFullUpdate,
  validateBorrow,
};
