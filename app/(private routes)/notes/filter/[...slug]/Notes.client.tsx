"use client";

import css from "./page.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useDebounce } from "use-debounce";
import { useState } from "react";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import type { NoteTag } from "@/types/note";
import Link from "next/link";
import { fetchNotes } from "@/lib/api/clientApi";

interface NotesClientProps {
  tag: NoteTag | "all";
}

const NotesClient = ({ tag }: NotesClientProps) => {
  const [query, setQuery] = useState("");
  const [debouncedTerm] = useDebounce(query, 500);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, error, isLoading, isSuccess } = useQuery({
    queryKey: ["notes", debouncedTerm, currentPage, tag],
    queryFn: () =>
      fetchNotes({
        search: debouncedTerm,
        page: currentPage,
        tag: tag !== "all" ? tag : undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const onChange = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-right" />

      <header className={css.toolbar}>
        <div className={css.toolbarTop}>
          <SearchBox onChange={onChange} value={query} />

          {isSuccess && data && data.notes.length > 0 && (
            <div className={css.paginationWrap}>
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={data.totalPages}
              />
            </div>
          )}

          <Link href="/notes/action/create" className={css.button}>
            Create note +
          </Link>
        </div>
      </header>

      {isLoading && <Loader />}
      {error && <ErrorMessage />}
      {data && data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {isSuccess && data && data.notes.length === 0 && (
        <div className={css.emptyState}>
          <h2 className={css.emptyTitle}>No notes yet</h2>
          <p className={css.emptyText}>
            Try a different search or create your first note to get started.
          </p>
          <Link href="/notes/action/create" className={css.button}>
            Create note +
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotesClient;
