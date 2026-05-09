function ErrorState({ message = "Something went wrong.", actionLabel, onAction }) {
  return (
    <div className="feedback-card feedback-card-error">
      <h2>Unable to load</h2>
      <p>{message}</p>
      {actionLabel && onAction ? (
        <button type="button" className="secondary-button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default ErrorState;
