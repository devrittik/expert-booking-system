function SearchBar({ value, onChange }) {
  return (
    <label className="search-field">
      <span className="field-label">Search experts</span>
      <input
        type="search"
        placeholder="Search by expert name"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export default SearchBar;
