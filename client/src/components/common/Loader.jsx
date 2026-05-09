function Loader({ label = "Loading..." }) {
  return (
    <div className="feedback-card">
      <div className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export default Loader;
