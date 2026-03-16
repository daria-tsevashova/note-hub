"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useAuthStore from "@/lib/store/authStore";
import { updateUserProfile } from "@/lib/api/clientApi";
import css from "./EditProfilePage.module.css";

export default function EditProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const handleSubmit = async (formData: FormData) => {
    setError("");
    setLoading(true);

    try {
      const username = formData.get("username") as string;
      const avatar = formData.get("avatar") as string;
      const updatedUser = await updateUserProfile({
        username,
        avatar: avatar.trim() || undefined,
      });
      setUser(updatedUser);
      router.push("/profile");
    } catch (err) {
      setError("Failed to update profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <div>
            <p className={css.eyebrow}>Profile settings</p>
            <h1 className={css.formTitle}>Edit Profile</h1>
          </div>
        </div>

        <div className={css.previewSection}>
          <div className={css.avatarRing}>
            <Image
              src={
                avatar ||
                user?.avatar ||
                "https://ac.goit.global/avatar-placeholder.png"
              }
              alt="User Avatar"
              width={128}
              height={128}
              className={css.avatar}
            />
          </div>
          <div className={css.previewCopy}>
            <p className={css.previewLabel}>Avatar preview</p>
            <p className={css.previewText}>
              Paste a direct image URL to refresh how your profile appears.
            </p>
          </div>
        </div>

        <form className={css.profileInfo} action={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={css.usernameWrapper}>
            <label htmlFor="avatar">Avatar URL:</label>
            <input
              id="avatar"
              name="avatar"
              type="url"
              className={css.input}
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
            <span className={css.helperText}>
              Leave empty to keep your current avatar or fall back to the
              default image.
            </span>
          </div>

          <div className={css.staticField}>
            <span className={css.staticLabel}>Email</span>
            <p>{user?.email ?? "user_email@example.com"}</p>
          </div>

          {error && <p className={css.errorMessage}>{error}</p>}

          <div className={css.actions}>
            <button type="submit" className={css.saveButton} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
