import Link from "next/link";
import { tags } from "@/types/note";
import css from "./SidebarNotes.module.css";

export function SidebarNotes() {
  return (
    <div className={css.sidebarPanel}>
      <p className={css.sidebarTitle}>Filters</p>

      <ul className={css.menuList}>
        <li className={css.menuItem}>
          <Link href={`/notes/filter/all`} className={css.menuLink}>
            All notes
          </Link>
        </li>
        {tags.map((tag) => (
          <li key={tag} className={css.menuItem}>
            <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SidebarNotes;
