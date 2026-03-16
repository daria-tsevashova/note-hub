"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import css from "./SignInPage.module.css";
import { login, LoginRequest } from "@/lib/api/clientApi";
import useAuthStore, { AuthState } from "@/lib/store/authStore";
import Link from "next/link";
import { getAuthErrorMessage } from "@/lib/api/authErrorMessage";

export default function SignInPage() {
  const router = useRouter();
  const setUser = useAuthStore((s: AuthState) => s.setUser);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload: LoginRequest = {
      email: String(fd.get("email") ?? ""),
      password: String(fd.get("password") ?? ""),
    };

    try {
      const user = await login(payload);
      setUser(user);
      router.push("/profile");
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err, "login"));
    }
  };

  useEffect(() => {
    document.title = "Sign-in | NoteHub";
  }, []);

  return (
    <main className={css.mainContent}>
      <div className={css.formCard}>
        <p className={css.eyebrow}>Welcome back</p>
        <h1 className={css.formTitle}>Sign in to NoteHub</h1>
        <p className={css.formSubtitle}>
          Continue where you left off and keep your notes organized in one calm
          workspace.
        </p>

        <form className={css.form} onSubmit={handleSubmit}>
          <div className={css.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              className={css.input}
              required
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              className={css.input}
              required
            />
          </div>

          <div className={css.actions}>
            <button type="submit" className={css.submitButton}>
              Log in
            </button>
          </div>

          <p className={css.error}>{error}</p>
        </form>

        <p className={css.switchText}>
          New to NoteHub?
          <Link href="/sign-up" className={css.switchLink}>
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}
