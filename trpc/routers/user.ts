import { scoreConfig } from "@/config/score";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { userAchievements } from "@/lib/db/schema/achievement";
import { posts } from "@/lib/db/schema/post";
import { userReadPosts } from "@/lib/db/schema/user-read-post";
import { TRPCError } from "@trpc/server";
import { count, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const userRouter = router({
    getByWalletAddress: publicProcedure
        .input(z.object({
            walletAddress: z.string(),
        }))
        .query(async ({ input }) => {
            const { walletAddress } = input;
            const user = await db.query.users.findFirst({
                where: eq(users.walletAddress, walletAddress),
                with: {
                    achievements: true,
                }
            });

            return user;
        }),

    updateProfile: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                location: z.string().nullable(),
                avatar: z.string().nullable(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const updatedUser = await db
                .update(users)
                .set({
                    name: input.name,
                    location: input.location,
                    avatar: input.avatar,
                    updatedAt: new Date(),
                })
                .where(eq(users.id, ctx.session.user.id))
                .returning();

            if (!updatedUser[0]) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found"
                });
            }

            return updatedUser[0];
        }),

    getScore: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.id;

        const calculatePostScore = async () => {
            const postCountResult = await db
                .select({
                    count: count(),
                })
                .from(posts)
                .where(eq(posts.userId, userId));

            const postCount = postCountResult[0]?.count || 0;
            return {
                name: "post",
                score: postCount * scoreConfig.post,
                count: postCount,
            };
        };

        const calculateShareScore = async () => {
            const user = await db.query.users.findFirst({
                where: eq(users.id, userId),
                columns: {
                    shareCount: true,
                },
            });
            const shareCount = user?.shareCount || 0;
            return {
                name: "share",
                score: shareCount * scoreConfig.share,
                count: shareCount,
            };
        };

        const calculateReadScore = async () => {
            const readCountResult = await db
                .select({
                    count: count(),
                })
                .from(userReadPosts)
                .where(eq(userReadPosts.userId, userId));

            const readCount = readCountResult[0]?.count || 0;
            return {
                name: "read",
                score: readCount * scoreConfig.read,
                count: readCount,
            };
        };

        const ruleCalculations = [
            calculatePostScore(),
            calculateShareScore(),
            calculateReadScore(),
        ];

        const results = await Promise.all(ruleCalculations);

        let totalScore = 0;
        const breakdown: { [key: string]: { score: number; count: number } } = {};

        for (const result of results) {
            totalScore += result.score;
            breakdown[result.name] = { score: result.score, count: result.count };
        }

        return {
            score: totalScore,
            postCount: breakdown.post?.count || 0,
            shareCount: breakdown.share?.count || 0,
            readCount: breakdown.read?.count || 0,
            postScore: breakdown.post?.score || 0,
            shareScore: breakdown.share?.score || 0,
            readScore: breakdown.read?.score || 0,
            // TODO: Referral count and score
            referralCount: 0,
            referralScore: 0,
        };
    }),

    getAchievements: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.id;

        const achievements = await db.query.userAchievements.findMany({
            where: eq(userAchievements.userId, userId),
        });

        return achievements;
    }),

    incrementShareCount: protectedProcedure.mutation(async ({ ctx }) => {
        await db
            .update(users)
            .set({
                shareCount: sql`${users.shareCount} + 1`,
            })
            .where(eq(users.id, ctx.session.user.id));
    }),
});