import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { parse } from "cookie";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";
import { User } from "@/types/user";

async function getCurrentUser(cookieHeader: string): Promise<User | null> {
  try {
    const meRes = await api.get<User>("users/me", {
      headers: {
        Cookie: cookieHeader,
      },
    });
    return meRes.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!sessionId && !accessToken && !refreshToken) {
      return NextResponse.json(null, { status: 200 });
    }

    if (accessToken) {
      const user = await getCurrentUser(cookieStore.toString());
      if (user) {
        return NextResponse.json(user, { status: 200 });
      }
    }

    if (refreshToken || sessionId) {
      const apiRes = await api.get("auth/session", {
        headers: {
          Cookie: cookieStore.toString(),
        },
      });

      const setCookie = apiRes.headers["set-cookie"];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);

          const options = {
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            path: parsed.Path,
            maxAge: Number(parsed["Max-Age"]),
          };

          if (parsed.sessionId)
            cookieStore.set("sessionId", parsed.sessionId, options);
          if (parsed.accessToken)
            cookieStore.set("accessToken", parsed.accessToken, options);
          if (parsed.refreshToken)
            cookieStore.set("refreshToken", parsed.refreshToken, options);
        }

        const user = await getCurrentUser(cookieStore.toString());
        if (user) {
          return NextResponse.json(user, { status: 200 });
        }
      }
    }

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(null, { status: 200 });
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(null, { status: 200 });
  }
}
