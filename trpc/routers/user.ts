import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
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

});