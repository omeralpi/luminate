import type { inferRouterOutputs } from "@trpc/server";

import { router } from "../trpc";

import { aiRouter } from "./ai";
import { authRouter } from "./auth";
import { postRouter } from "./post";

export const appRouter = router({
    auth: authRouter,
    post: postRouter,
    ai: aiRouter
});

export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;