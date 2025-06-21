import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { initTRPC } from "@trpc/server";
import { eq } from "drizzle-orm";
import superjson from "superjson";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape }) {
        return shape;
    },
});

const isAuthedMiddleware = t.middleware(async ({ ctx, next }) => {
    const cookies = ctx.cookies;

    const sessionId = cookies[lucia.sessionCookieName] ?? null;
    if (!sessionId) {
        throw new Error("Unauthorized");
    }

    const { user } = await lucia.validateSession(sessionId);
    if (!user) {
        throw new Error("Unauthorized");
    }

    const [fullUser] = await db.select()
        .from(users)
        .where(eq(users.id, Number(user.id)));

    if (!fullUser) {
        throw new Error("User not found");
    }

    return next({
        ctx: {
            ...ctx,
            session: {
                user: fullUser,
            },
        },
    });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthedMiddleware);

export const mergeRouters = t.mergeRouters;
export const createCallerFactory = t.createCallerFactory;