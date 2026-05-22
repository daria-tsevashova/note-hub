import { parse } from "cookie";

export function logErrorResponse(errorObj: unknown): void {
  const green = '\x1b[32m';
  const yellow = '\x1b[33m';
  const reset = '\x1b[0m';

  // Стрелка зелёная, текст жёлтый
  console.log(`${green}> ${yellow}Error Response Data:${reset}`);
  console.dir(errorObj, { depth: null, colors: true });
}

export function getCookieOptions(parsed: Record<string, string | undefined>) {
  const sameSite = parsed.SameSite?.toLowerCase();

  return {
    expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
    path: parsed.Path || "/",
    maxAge:
      parsed["Max-Age"] !== undefined && !Number.isNaN(Number(parsed["Max-Age"]))
        ? Number(parsed["Max-Age"])
        : undefined,
    httpOnly: parsed.HttpOnly !== undefined,
    secure: parsed.Secure !== undefined,
    sameSite:
      sameSite === "strict" || sameSite === "lax" || sameSite === "none"
        ? sameSite
        : undefined,
  };
}

export function applySetCookieHeaders(
  cookieStore: { set(...args: any[]): any },
  setCookie: string | string[],
) {
  const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
  for (const cookieStr of cookieArray) {
    const parsed = parse(cookieStr);
    const options = getCookieOptions(parsed);

    if (parsed.sessionId) cookieStore.set("sessionId", parsed.sessionId, options);
    if (parsed.accessToken) cookieStore.set("accessToken", parsed.accessToken, options);
    if (parsed.refreshToken) cookieStore.set("refreshToken", parsed.refreshToken, options);
  }
}
