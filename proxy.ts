import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { checkSession } from "./lib/api/serverApi";

const publicRoutes = ["/sign-in", "/sign-up"];
const privateRoutes = ["/profile", "/notes", "/notes/filter"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!accessToken) {
    if (refreshToken || sessionId) {
      const cookieString = cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");
      const data = (await checkSession({ cookies: cookieString })) as any;
      const setCookie = data?.headers?.["set-cookie"];

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
            maxAge: Number(parsed["Max-Age"]),
            httpOnly: parsed.HttpOnly !== undefined,
            secure: parsed.Secure !== undefined,
            sameSite: sameSiteValue,
          };
          if (parsed.sessionId)
            cookieStore.set("sessionId", parsed.sessionId, options);
          if (parsed.accessToken)
            cookieStore.set("accessToken", parsed.accessToken, options);
          if (parsed.refreshToken)
            cookieStore.set("refreshToken", parsed.refreshToken, options);
        }

        const headers = new Headers(request.headers);
        headers.set("cookie", cookieStore.toString());

        const response = NextResponse.next({ request: { headers } });

        // Обов'язково прокидаємо нові куки назад у браузер
        cookieArray.forEach((cookieStr) => {
          response.headers.append("Set-Cookie", cookieStr);
        });

        return response;
      }
    }

    if (isPublicRoute) {
      return NextResponse.next();
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/sign-in",
    "/sign-up",
    "/notes/:path*",
    "/notes/filter/:path*",
  ],
};
