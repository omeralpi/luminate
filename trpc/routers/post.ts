import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const postRouter = router({
    list: publicProcedure.query(async () => {
        return db.query.posts.findMany({
            with: {
                user: true,
            },
            orderBy: desc(posts.createdAt),
            limit: 10,
        })
    }),

    detail: publicProcedure.input(z.object({
        id: z.number(),
    })).query(async ({ input }) => {
        const post = await db.query.posts.findFirst({
            where: eq(posts.id, input.id),
            with: {
                user: true,
            },
        })

        return post;
    }),

    create: protectedProcedure
        .input(z.object({
            title: z.string(),
            content: z.any(),
            cover: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            const post = await db.insert(posts).values({
                title: input.title,
                content: input.content,
                cover: input.cover,
                userId: ctx.session.user.id,
            });

            return post;
        }),
});