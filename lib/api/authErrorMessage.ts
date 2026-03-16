import { isAxiosError } from "axios";

type AuthAction = "login" | "register";

function collectErrorText(value: unknown): string {
  if (!value) return "";

  if (typeof value === "string") return value;

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const fields = [obj.message, obj.error, obj.response]
      .map(collectErrorText)
      .filter(Boolean)
      .join(" ");

    return fields;
  }

  return "";
}

export function getAuthErrorMessage(
  error: unknown,
  action: AuthAction,
): string {
  if (!isAxiosError(error)) {
    return action === "login"
      ? "Sign in failed. Please try again."
      : "Sign up failed. Please try again.";
  }

  const status = error.response?.status;
  const rawText = collectErrorText(
    error.response?.data || error.message,
  ).toLowerCase();

  if (
    status === 401 ||
    rawText.includes("invalid") ||
    rawText.includes("unauthorized") ||
    rawText.includes("credential") ||
    rawText.includes("wrong password") ||
    rawText.includes("incorrect password")
  ) {
    return "Invalid email or password.";
  }

  if (
    status === 409 ||
    rawText.includes("already") ||
    rawText.includes("exists") ||
    rawText.includes("in use") ||
    rawText.includes("registered") ||
    rawText.includes("taken")
  ) {
    return "An account with this email already exists.";
  }

  if (
    rawText.includes("password") &&
    (rawText.includes("short") ||
      rawText.includes("length") ||
      rawText.includes("weak"))
  ) {
    return "Password is too weak or too short.";
  }

  if (
    rawText.includes("email") &&
    (rawText.includes("invalid") || rawText.includes("format"))
  ) {
    return "Please enter a valid email.";
  }

  if (status && status >= 500) {
    return "Server is temporarily unavailable. Please try again later.";
  }

  return action === "login"
    ? "Could not sign in. Please check your credentials and try again."
    : "Could not sign up. Please check your details and try again.";
}
