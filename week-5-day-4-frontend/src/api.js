// Every request to the library API goes through here, so the base URL
// only lives in one place. Swap this for "/api" if you enable the Vite
// proxy in vite.config.js instead of relying on CORS.
const BASE_URL = "http://localhost:3000";

export async function fetchBooks(search = "") {
  const url = search
    ? `${BASE_URL}/api/books?search=${encodeURIComponent(search)}`
    : `${BASE_URL}/api/books`;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load books");
  return data;
}

export async function createBook(book) {
  const res = await fetch(`${BASE_URL}/api/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

export async function deleteBook(id) {
  const res = await fetch(`${BASE_URL}/api/books/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}
