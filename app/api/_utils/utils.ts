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
    // Parse cookie name/value and attributes manually because `cookie.parse`
    // only extracts the name=value and ignores attributes like HttpOnly/Secure.
    const parts = cookieStr.split(';').map((p) => p.trim());
    const [nameValue, ...attrParts] = parts;
    const eqIndex = nameValue.indexOf('=');
    const name = eqIndex >= 0 ? nameValue.slice(0, eqIndex) : nameValue;
    const value = eqIndex >= 0 ? nameValue.slice(eqIndex + 1) : '';

    const parsed: Record<string, string | boolean | undefined> = {};
    parsed[name] = decodeURIComponent(value);

    for (const attr of attrParts) {
      const [k, ...rest] = attr.split('=');
      const key = k.trim();
      if (rest.length === 0) {
        // Flag attributes like HttpOnly or Secure
        parsed[key] = true;
      } else {
        parsed[key] = rest.join('=').trim();
      }
    }

    const options = getCookieOptions(parsed as Record<string, string | undefined>);

    if ((parsed as any).sessionId) cookieStore.set('sessionId', (parsed as any).sessionId, options);
    if ((parsed as any).accessToken) cookieStore.set('accessToken', (parsed as any).accessToken, options);
    if ((parsed as any).refreshToken) cookieStore.set('refreshToken', (parsed as any).refreshToken, options);
  }
}
