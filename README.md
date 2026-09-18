# Week 5 Day 4 — Library Catalog Frontend

## Setup

You need two terminals — one for the backend, one for the frontend.

**Backend**
```bash
cd week-5-day-3-assignment
npm install
node server.js   # http://localhost:3000
```

**Frontend**
```bash
cd week-5-day-4-frontend
npm install
npm run dev       # http://localhost:5173
```

The backend has `app.use(cors())` enabled so the frontend (port 5173) can
call it directly at `http://localhost:3000`.

## Features

- **Book catalog** — fetches all books on mount, shows a loading spinner,
  and displays an error state if the API is unreachable. Each book card
  shows a green "Available" badge or a red "Borrowed by {name}" badge.
- **Add a book** — form posts to `POST /api/books`; on success the new
  book is appended to the list without refetching and a toast confirms
  it; on a 400 the API's validation message is shown under the form.
- **Search** — debounced 300ms after typing stops, queries
  `GET /api/books?search=`, and shows "No books found" on empty results.
- **Delete (bonus)** — optimistic UI: the book disappears immediately on
  confirm, and is restored with the API's error message if the delete
  fails (e.g. the book is currently borrowed).

## Notes

- The API base URL is set in `src/api.js`. If you'd rather avoid CORS,
  uncomment the proxy block in `vite.config.js` and switch `BASE_URL` to
  a relative `/api` path.
- Genre is shown with a colored left border on each card (fiction,
  technology, business, autobiography) rather than plain text, so it's
  scannable at a glance.
