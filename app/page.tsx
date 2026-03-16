"use client";

import css from "./page.module.css";
import Footer from "@/components/Footer/Footer";
import Link from "next/link";
import useAuthStore from "@/lib/store/authStore";

export default function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className={css.page}>
      <section className={css.hero}>
        <div className={css.heroGlowLeft}></div>
        <div className={css.heroGlowRight}></div>

        <div className={css.heroPanel}>
          <p className={css.eyebrow}>Smart note workspace</p>
          <h1 className={css.heroTitle}>
            Welcome to <span className={css.heroAccent}>NoteHub</span>
          </h1>
          <p className={css.heroSub}>
            Capture your wildest ideas in a sanctuary of focus. High-end note
            management powered by clarity and elegance.
          </p>

          <div className={css.heroActions}>
            <Link href="/notes/filter/all" className={css.ctaPrimary}>
              Open notes
            </Link>
            <Link
              href={isAuthenticated ? "/profile" : "/sign-up"}
              className={css.ctaSecondary}
            >
              {isAuthenticated ? "Profile" : "Create account"}
            </Link>
          </div>
        </div>
      </section>

      <section className={css.features}>
        <div className={css.featuresGrid}>
          <div className={css.card}>
            <h3 className={css.cardTitle}>Pure Focus</h3>
            <p className={css.cardText}>
              A distraction-free space designed to help you think clearly, write
              faster, and stay in flow longer.
            </p>
          </div>
          <div className={css.card}>
            <h3 className={css.cardTitle}>Seamless Access</h3>
            <p className={css.cardText}>
              Your notes stay with you wherever you sign in, so every idea is
              always within reach.
            </p>
          </div>
          <div className={css.card}>
            <h3 className={css.cardTitle}>Smart Organization</h3>
            <p className={css.cardText}>
              Search and tags keep your thoughts structured, elegant, and easy
              to find in seconds.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
