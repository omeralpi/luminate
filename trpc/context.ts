
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export interface Session {
    user: {
        id: number;
        walletAddress: string;
    };
}

function parseCookies(cookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {};

    if (cookieHeader) {
        cookieHeader.split(";").forEach((cookie) => {
            const [key, value] = cookie.trim().split("=");
            if (key && value) {
                cookies[key] = decodeURIComponent(value);
            }
        });
    }

    return cookies;
}

export async function createContext(opts?: FetchCreateContextFnOptions) {
    const cookieHeader = opts?.req.headers.get("cookie") || "";
    const parsedCookies = parseCookies(cookieHeader);

    return {
        headers: opts && Object.fromEntries(opts.req.headers),
        cookies: parsedCookies,
        session: undefined as Session | undefined,
    };
}

export type Context = Awaited<ReturnType<typeof createContext>>;