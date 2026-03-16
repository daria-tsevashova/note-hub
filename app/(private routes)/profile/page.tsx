import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getMe } from "@/lib/api/serverApi";
import css from "./ProfilePage.module.css";

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "User profile page — view and edit your profile.",
};

export default async function ProfilePage() {
  const user = await getMe();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <div>
            <p className={css.eyebrow}>Private profile</p>
            <h1 className={css.formTitle}>Profile Overview</h1>
          </div>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.heroSection}>
          <div className={css.avatarWrapper}>
            <div className={css.avatarRing}>
              <Image
                src={
                  user.avatar || "https://ac.goit.global/avatar-placeholder.png"
                }
                alt="User Avatar"
                width={128}
                height={128}
                className={css.avatar}
              />
            </div>
          </div>

          <div className={css.heroCopy}>
            <h2 className={css.displayName}>{user.username}</h2>
            <p className={css.email}>{user.email}</p>
            <p className={css.supportingText}>
              Manage your public identity, refresh your avatar, and keep your
              account details polished across every session.
            </p>
          </div>
        </div>

        <div className={css.profileInfo}>
          <div className={css.infoRow}>
            <span className={css.infoLabel}>Username</span>
            <span className={css.infoValue}>{user.username}</span>
          </div>
          <div className={css.infoRow}>
            <span className={css.infoLabel}>Email</span>
            <span className={css.infoValue}>{user.email}</span>
          </div>
          <div className={css.infoRow}>
            <span className={css.infoLabel}>Avatar</span>
            <span className={css.infoValue}>
              {user.avatar ? "Custom image set" : "Using placeholder avatar"}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
