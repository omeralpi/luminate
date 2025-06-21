import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { pinataService } from "@/lib/services/pinata";
import { lexicalToText } from "@/lib/utils/render-lexical-content";
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
            subTitle: z.string().optional(),
            content: z.any(),
            cover: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            const ipfsResult = await pinataService.uploadJSON({
                title: input.title,
                content: lexicalToText(input.content),
                author: ctx.session.user.id,
                tags: [],
                timestamp: new Date().toISOString(),
            });

            const post = await db.insert(posts).values({
                title: input.title,
                subTitle: input.subTitle,
                content: input.content,
                cover: input.cover,
                userId: ctx.session.user.id,
                ipfsHash: ipfsResult.ipfsHash,
                gatewayUrl: ipfsResult.gatewayUrl,
            });

            return {
                post,
                ipfsUploaded: !!ipfsResult,
            };
        }),
});