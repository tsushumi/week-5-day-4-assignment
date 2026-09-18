import { useEffect, useRef, useState } from "react";
import { fetchBooks, deleteBook } from "./api.js";
import { useDebounce } from "./hooks/useDebounce.js";
import BookList from "./components/BookList.jsx";
import SearchBar from "./components/SearchBar.jsx";
import AddBookForm from "./components/AddBookForm.jsx";
import Toast from "./components/Toast.jsx";
import ConfirmDialog from "./components/ConfirmDialog.jsx";

export default function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const [toastMessage, setToastMessage] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const hasLoadedOnce = useRef(false);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!hasLoadedOnce.current) {
        setLoading(true);
      } else {
        setSearching(true);
      }
      setError(null);

      try {
        const result = await fetchBooks(debouncedSearch);
        if (active) setBooks(result.data);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) {
          setLoading(false);
          setSearching(false);
          hasLoadedOnce.current = true;
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [debouncedSearch]);

  const handleBookAdded = (newBook) => {
    setBooks((prev) => [...prev, newBook]);
  };

  const handleRequestDelete = (book) => {
    setPendingDelete(book);
  };

  const handleCancelDelete = () => {
    setPendingDelete(null);
  };

  const handleConfirmDelete = async () => {
    const book = pendingDelete;
    setPendingDelete(null);

    // Optimistic update: remove immediately, put it back if the API objects.
    setBooks((prev) => prev.filter((b) => b.id !== book.id));

    const { ok, data } = await deleteBook(book.id);

    if (ok) {
      setToastMessage(`"${book.title}" was removed from the catalog.`);
    } else {
      setBooks((prev) => [...prev, book].sort((a, b) => a.id - b.id));
      setToastMessage(data.error || "Couldn't delete that book.");
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="page-header__eyebrow">Nairobi Public Library</p>
          <h1>Catalog</h1>
        </div>
      </header>

      <div className="search-row">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        {searching && <span className="search-row__status">Searching…</span>}
      </div>

      <main className="layout">
        <section className="layout__catalog" aria-label="Books">
          <BookList
            books={books}
            loading={loading}
            error={error}
            searchActive={Boolean(debouncedSearch)}
            onRequestDelete={handleRequestDelete}
          />
        </section>

        <aside className="layout__sidebar" aria-label="Add a book">
          <AddBookForm onBookAdded={handleBookAdded} onSuccessMessage={setToastMessage} />
        </aside>
      </main>

      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />

      <ConfirmDialog
        book={pendingDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
