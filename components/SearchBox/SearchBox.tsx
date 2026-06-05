import { memo } from "react";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBox = memo(({ value, onChange }: SearchBoxProps) => {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      aria-label="Search notes"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
});

SearchBox.displayName = "SearchBox";

export default SearchBox;
