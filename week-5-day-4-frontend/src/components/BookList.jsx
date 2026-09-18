import BookCard from "./BookCard.jsx";

export default function BookList({ books, loading, error, searchActive, onRequestDelete }) {
  if (loading) {
    return (
      <div className="state-panel">
        <span className="spinner" aria-hidden="true" />
        <p>Loading the catalog…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-panel state-panel--error">
        <p>Couldn't reach the library API.</p>
        <p className="state-panel__detail">{error}</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="state-panel">
        <p>{searchActive ? "No books found." : "The catalog is empty."}</p>
      </div>
    );
  }

  return (
    <ul className="book-grid">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onRequestDelete={onRequestDelete} />
      ))}
    </ul>
  );
}
