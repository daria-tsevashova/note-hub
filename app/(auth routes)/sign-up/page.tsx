"use client";

import { register, RegisterRequest } from "@/lib/api/clientApi";
import useAuthStore from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import css from "./SignUpPage.module.css";
import Link from "next/link";
import { getAuthErrorMessage } from "@/lib/api/authErrorMessage";

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload: RegisterRequest = {
      email: String(fd.get("email") ?? ""),
      password: String(fd.get("password") ?? ""),
    };

    try {
      const user = await register(payload);
      setUser(user);
      router.push("/profile");
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err, "register"));
    }
  };

  useEffect(() => {
    document.title = `Sign-up | NoteHub`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        `Create a new account on NoteHub. Sign up with your email and password to get started.`,
      );
  }, []);

  return (
    <main className={css.mainContent}>
      <div className={css.formCard}>
        <p className={css.eyebrow}>Create account</p>
        <h1 className={css.formTitle}>Join NoteHub</h1>
        <p className={css.formSubtitle}>
          Set up your account to save ideas, manage notes by tags, and access
          everything from one elegant space.
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
              Register
            </button>
          </div>

          <p className={css.error}>{error}</p>
        </form>

        <p className={css.switchText}>
          Already have an account?
          <Link href="/sign-in" className={css.switchLink}>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
