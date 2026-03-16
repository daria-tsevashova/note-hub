import axios from "axios";

function resolveBaseURL(): string {
  if (typeof window !== "undefined") {
    return "/api";
  }

  const explicitOrigin =
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.API_URL ??
    process.env.SITE_URL;

  if (explicitOrigin) {
    return new URL("/api", explicitOrigin).toString();
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api`;
  }

  return "http://localhost:3000/api";
}

export const baseURL = resolveBaseURL();

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
