const GENRE_LABELS = {
  fiction: "Fiction",
  technology: "Technology",
  business: "Business",
  autobiography: "Autobiography",
};

export default function BookCard({ book, onRequestDelete }) {
  const genreClass = `genre-${book.genre}`;
  const genreLabel = GENRE_LABELS[book.genre] || book.genre;

  return (
    <li className={`book-card ${genreClass}`}>
      <div className="book-card__id">No. {String(book.id).padStart(3, "0")}</div>

      <h3 className="book-card__title">{book.title}</h3>
      <p className="book-card__author">{book.author}</p>
      <p className="book-card__genre">{genreLabel}</p>

      <div className="book-card__footer">
        {book.available ? (
          <span className="badge badge--available">Available</span>
        ) : (
          <span className="badge badge--borrowed">Borrowed by {book.borrowedBy}</span>
        )}

        <button
          type="button"
          className="book-card__delete"
          onClick={() => onRequestDelete(book)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
