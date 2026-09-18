export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <label htmlFor="catalog-search" className="search-bar__label">
        Search the catalog
      </label>
      <input
        id="catalog-search"
        type="text"
        className="search-bar__input"
        placeholder="Search by title or author…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
