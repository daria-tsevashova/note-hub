import axios from "axios";

function resolveBaseURL(): string {
  if (typeof window !== "undefined") {
    return "/api";
  }

  // Використовуємо адресу бекенда з твого .env
  const apiUrl = process.env.NOTEHUB_API_URL;

  if (apiUrl) {
    return apiUrl;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Цей fallback використовується тільки під час локальної розробки
  // Якщо в .env нічого не вказано, стукаємо на 3001 порт бекенда
  return "http://localhost:3001";
}

export const baseURL = resolveBaseURL();

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
