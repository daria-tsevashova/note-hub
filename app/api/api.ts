import axios from "axios";

const backendBaseURL =
  process.env.NOTEHUB_API_URL ?? "https://notehub-63w5.onrender.com";

export const api = axios.create({
  baseURL: backendBaseURL,
  withCredentials: true,
});
