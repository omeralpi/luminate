import type { inferRouterOutputs } from "@trpc/server";

import { router } from "../trpc";
import { authRouter } from "./auth";

export const appRouter = router({
    auth: authRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;