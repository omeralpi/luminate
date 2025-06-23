import { db } from "@/lib/db";
import { postTags, posts, tags, userReadPosts } from "@/lib/db/schema";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const postRouter = router({
    list: publicProcedure
        .input(
            z.object({
                cursor: z.number().nullish(),
                limit: z.number().min(1).max(100).default(10),
                tag: z.string().optional(),
                search: z.string().optional(),
            })
        )
        .query(async ({ input }) => {
            const { cursor, limit, tag, search } = input;

            const postList = await db.query.posts.findMany({
                limit,
                offset: cursor ?? 0,
                orderBy: [desc(posts.createdAt)],
                where: (posts, { exists }) => {
                    const conditions = [];

                    if (tag) {
                        conditions.push(exists(db.select().from(postTags)
                            .leftJoin(tags, eq(postTags.tagId, tags.id))
                            .where(and(eq(postTags.postId, posts.id), ilike(tags.name, `%${tag}%`))))
                        );
                    }

                    if (search) {
                        conditions.push(
                            or(
                                ilike(posts.title, `%${search}%`),
                                ilike(posts.subTitle, `%${search}%`)
                            )!
                        );
                    }

                    if (conditions.length > 0) {
                        return and(...conditions);
                    }

                    return undefined;
                },
                with: {
                    user: true,
                    postTags: {
                        with: {
                            tag: true,
                        }
                    }
                },
            });
            return postList;
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
        .input(
            z.object({
                title: z.string(),
                subTitle: z.string().optional(),
                content: z.any(),
                cover: z.string().optional(),
                tags: z.array(z.string()).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const newPostQueryResult = await db
                .insert(posts)
                .values({
                    title: input.title,
                    subTitle: input.subTitle,
                    content: input.content,
                    userId: userId,
                    cover: input.cover,
                })
                .returning({ id: posts.id });

            const postId = newPostQueryResult[0]?.id;

            if (!postId) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create post",
                });
            }

            if (input.tags && input.tags.length > 0) {
                const lowercasedTags = input.tags.map(t => t.toLowerCase().trim()).filter(t => t.length > 0);
                if (lowercasedTags.length > 0) {
                    const existingTags = await db.select().from(tags).where(inArray(tags.name, lowercasedTags));
                    const existingTagNames = existingTags.map(t => t.name);
                    const newTagNames = lowercasedTags.filter(t => !existingTagNames.includes(t));

                    let newTags: { id: number; name: string; createdAt: Date; }[] = [];
                    if (newTagNames.length > 0) {
                        newTags = await db.insert(tags).values(newTagNames.map(name => ({ name }))).returning();
                    }

                    const allTags = [...existingTags, ...newTags];

                    await db.insert(postTags).values(allTags.map(tag => ({
                        postId,
                        tagId: tag.id,
                    })));
                }
            }
            return { success: true, postId };
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

    byId: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
            const post = await db.query.posts.findFirst({
                where: eq(posts.id, input.id),
                with: {
                    user: true,
                    postTags: {
                        with: {
                            tag: true,
                        }
                    }
                },
            });

            if (!post) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Post not found",
                });
            }

            return post;
        }),

    read: protectedProcedure
        .input(z.object({ postId: z.number() }))
        .mutation(async ({ input, ctx }) => {
            const userId = ctx.session.user.id;
            const postId = input.postId;

            const existingRead = await db.query.userReadPosts.findFirst({
                where: and(
                    eq(userReadPosts.userId, userId),
                    eq(userReadPosts.postId, postId)
                ),
            });

            if (existingRead) {
                return { success: true, message: "Post already marked as read." };
            }

            await db.insert(userReadPosts).values({
                userId,
                postId,
                createdAt: new Date(),
            });

            return { success: true };
        }),

    myPosts: protectedProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).optional().default(10),
                offset: z.number().optional().default(0),
            })
        )
        .query(async ({ input, ctx }) => {
            const { limit, offset } = input;
            const userId = ctx.session.user.id;

            const postList = await db.query.posts.findMany({
                limit,
                offset,
                orderBy: [desc(posts.createdAt)],
                where: eq(posts.userId, userId),
                with: {
                    user: true,
                    postTags: {
                        with: {
                            tag: true,
                        }
                    }
                },
            });

            const totalPosts = await db.select({
                count: count()
            }).from(posts).where(eq(posts.userId, userId));

            return {
                posts: postList,
                total: totalPosts[0].count,
            };
        }),
});