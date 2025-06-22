import { db } from "@/lib/db";
import { posts, userReadPosts } from "@/lib/db/schema";
import { pinataService } from "@/lib/services/pinata";
import { lexicalToText } from "@/lib/utils/render-lexical-content";
import { TRPCError } from "@trpc/server";
import { count, desc, eq } from "drizzle-orm";
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
        });

        if (!post) {
            return null;
        }

        const readCountResult = await db.select({
            count: count()
        }).from(userReadPosts).where(eq(userReadPosts.postId, input.id));

        return {
            ...post,
            readCount: readCountResult[0].count,
        };
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

    confirmNftMint: protectedProcedure
        .input(z.object({
            postId: z.number(),
            transactionHash: z.string(),
            stellarAddress: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const post = await db.query.posts.findFirst({
                where: eq(posts.id, input.postId),
            });

            if (!post) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Post not found",
                });
            }

            if (post.userId !== ctx.session.user.id) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You can only mint your own posts",
                });
            }

            if (post.nftMinted) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Post already minted as NFT",
                });
            }

            await db
                .update(posts)
                .set({
                    nftMinted: true,
                    nftTransactionHash: input.transactionHash,
                    nftMintedAt: new Date(),
                })
                .where(eq(posts.id, input.postId));

            return {
                success: true,
                postId: input.postId,
                transactionHash: input.transactionHash
            };
        }),

    markAsRead: protectedProcedure
        .input(z.object({
            postId: z.number(),
        }))
        .mutation(async ({ input, ctx }) => {
            await db.insert(userReadPosts).values({
                postId: input.postId,
                userId: ctx.session.user.id,
            }).onConflictDoNothing();

            return { success: true };
        }),
});