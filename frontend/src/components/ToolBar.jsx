import { useEffect } from "react";
import { Search as LucideSearch, ChevronDown as LucideChevronDown } from "lucide-react";

function SafeSearch(props) {
  useEffect(() => () => {}, []);
  return <LucideSearch {...props} />;
}

function SafeChevronDown(props) {
  useEffect(() => () => {}, []);
  return <LucideChevronDown {...props} />;
}

export default function Toolbar({ query, sort, onSearch, onSortChange }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch?.(query);
    }
  };

  const handleSortChange = (e) => {
    e.preventDefault();
    onSortChange?.(e.target.value);
  };

  return (
    <div className="searchbar">
      <div className="searchbox">
        <SafeSearch className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Search by name"
          value={query}
          onChange={(e) => onSearch?.(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="sort-select">
        <select value={sort} onChange={handleSortChange}>
          <option value="">Sort by price</option>
          <option value="asc">Lowest first</option>
          <option value="desc">Highest first</option>
        </select>
        <span className="select-caret">
          <SafeChevronDown size={16} />
        </span>
      </div>
    </div>
  );
}
