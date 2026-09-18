export default function ConfirmDialog({ book, onConfirm, onCancel }) {
  if (!book) return null;

  return (
    <div className="confirm-overlay" role="presentation" onClick={onCancel}>
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-heading"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-heading">Remove this book?</h2>
        <p>
          Are you sure you want to delete <strong>{book.title}</strong>? This can't be undone.
        </p>
        <div className="confirm-dialog__actions">
          <button type="button" className="confirm-dialog__cancel" onClick={onCancel}>
            Keep it
          </button>
          <button type="button" className="confirm-dialog__confirm" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
