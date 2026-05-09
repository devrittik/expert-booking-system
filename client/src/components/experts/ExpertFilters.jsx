import { CATEGORIES } from "../../constants/index.js";

function ExpertFilters({ activeCategory, onChange }) {
  return (
    <label className="search-field">
      <span className="field-label">Category</span>
      <select value={activeCategory} onChange={(event) => onChange(event.target.value)}>
        <option value="">All</option>
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </label>
  );
}

export default ExpertFilters;
