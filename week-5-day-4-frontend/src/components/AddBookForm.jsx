import { useState } from "react";
import { createBook } from "../api.js";

const EMPTY_FORM = { title: "", author: "", isbn: "", genre: "fiction" };

export default function AddBookForm({ onBookAdded, onSuccessMessage }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { ok, data } = await createBook(formData);

      if (ok) {
        onBookAdded(data.data);
        onSuccessMessage(`"${data.data.title}" was added to the catalog.`);
        setFormData(EMPTY_FORM);
      } else {
        setError(data.error || "Something went wrong adding that book.");
      }
    } catch (err) {
      setError(err.message || "Couldn't reach the library API.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h2 className="add-form__heading">Add to the catalog</h2>

      <div className="field">
        <label htmlFor="field-title">Title</label>
        <input
          id="field-title"
          type="text"
          value={formData.title}
          onChange={handleChange("title")}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="field-author">Author</label>
        <input
          id="field-author"
          type="text"
          value={formData.author}
          onChange={handleChange("author")}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="field-isbn">ISBN</label>
        <input
          id="field-isbn"
          type="text"
          placeholder="978-0-000000-0"
          value={formData.isbn}
          onChange={handleChange("isbn")}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="field-genre">Genre</label>
        <select id="field-genre" value={formData.genre} onChange={handleChange("genre")}>
          <option value="fiction">Fiction</option>
          <option value="technology">Technology</option>
          <option value="business">Business</option>
          <option value="autobiography">Autobiography</option>
        </select>
      </div>

      {error && <p className="add-form__error">{error}</p>}

      <button type="submit" className="add-form__submit" disabled={submitting}>
        {submitting ? "Adding…" : "Add book"}
      </button>
    </form>
  );
}
