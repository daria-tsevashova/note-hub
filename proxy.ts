import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { checkSession } from "./lib/api/serverApi";

const publicRoutes = ["/sign-in", "/sign-up"];
const privateRoutes = ["/profile", "/notes", "/notes/filter"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const sessionId = cookieStore.get("sessionId")?.value;

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));

  let response = NextResponse.next();
  let currentAccessToken = accessToken;

  // 1. Спроба оновити сесію, якщо токен відсутній
  if (!currentAccessToken && (refreshToken || sessionId)) {
    const cookieString = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    try {
      // Примітка: checkSession має повертати заголовки відповіді (res.headers), 
      // щоб ми могли отримати "set-cookie"
      const data = await checkSession({ cookies: cookieString });
      const setCookie = (data as any)?.headers?.["set-cookie"];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);
          const sameSiteValue =
            parsed.SameSite?.toLowerCase() === "strict" ||
            parsed.SameSite?.toLowerCase() === "lax" ||
            parsed.SameSite?.toLowerCase() === "none"
              ? (parsed.SameSite.toLowerCase() as "strict" | "lax" | "none")
              : undefined;

          const options = {
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            path: parsed.Path || "/",
            maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
            httpOnly: parsed.HttpOnly !== undefined,
            secure: parsed.Secure !== undefined,
            sameSite: sameSiteValue,
          };

          if (parsed.sessionId) response.cookies.set("sessionId", parsed.sessionId, options);
          if (parsed.accessToken) {
            response.cookies.set("accessToken", parsed.accessToken, options);
            currentAccessToken = parsed.accessToken; 
          }
          if (parsed.refreshToken) response.cookies.set("refreshToken", parsed.refreshToken, options);
        }

        // Оновлюємо заголовок cookie для поточного запиту (щоб сервер побачив нові дані відразу)
        const updatedCookies = response.cookies.getAll().map(c => `${c.name}=${c.value}`).join("; ");
        response.headers.set("cookie", updatedCookies);
      }
    } catch (e) {
      console.error("Middleware: session refresh failed", e);
    }
  }

  // 2. Логіка редіректів
  if (!currentAccessToken && isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (currentAccessToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/notes", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth/callback).*)"],
};
