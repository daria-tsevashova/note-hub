import type { Metadata } from "next";
import css from "./CreateNote.module.css";
import NoteForm from "@/components/NoteForm/NoteForm";

const CreateNote = async () => {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <div className={css.hero}>
          <p className={css.eyebrow}>New note</p>
          <h1 className={css.title}>Create Your Next Note</h1>
          <p className={css.subtitle}>
            Capture an idea quickly and organize it instantly with the right
            title, content and tag.
          </p>
        </div>

        <div className={css.formCard}>
          <NoteForm />
        </div>
      </div>
    </main>
  );
};

export default CreateNote;

export const metadata: Metadata = {
  title: "Note Hub — Create Note",
  description: "Create a new note in Note Hub. Add title, content and tag.",
  openGraph: {
    title: "Note Hub — Create Note",
    description: "Create a new note in Note Hub. Add title, content and tag.",
    url: "https://08-zustand-iota-sage.vercel.app/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        alt: "Note Hub - Create Note",
      },
    ],
  },
};
