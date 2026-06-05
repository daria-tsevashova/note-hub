import { api } from "./api";
import { Note } from "@/types/note";
import { User } from "@/types/user";
import axios, { AxiosResponse } from "axios";
import { cookies } from "next/headers";

type CookiesParam = { cookies?: string };

export async function checkSession({ cookies }: CookiesParam = {}): Promise<User | null> {
  try {
    const res = await api.get<User | null>("/auth/session", {
      headers: cookies ? { cookie: cookies } : undefined,
    });
    return res.data;
  } catch (error) {
    console.error("Server API Error (checkSession):", error);
    return null;
  }
}

export async function getMe(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    if (!cookieString) return null;

    const res = await api.get<User>("/users/me", {
      headers: { cookie: cookieString },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    console.error("Server API Error (getMe):", error);
    return null;
  }
}

export async function fetchNotes(
  params?: { search?: string; page?: number; tag?: string },
  { cookies }: CookiesParam = {}
): Promise<Note[]> {
  try {
    const res = await api.get<Note[]>("/notes", {
      params,
      headers: cookies ? { cookie: cookies } : undefined,
    });
    return res.data;
  } catch (error) {
    console.error("Server API Error (fetchNotes):", error);
    return [];
  }
}

export async function fetchNoteById(
  id: string,
  { cookies }: CookiesParam = {}
): Promise<Note | null> {
  try {
    const res = await api.get<Note>(`/notes/${id}`, {
      headers: cookies ? { cookie: cookies } : undefined,
    });
    return res.data;
  } catch (error) {
    console.error(`Server API Error (fetchNoteById ${id}):`, error);
    return null;
  }
}
