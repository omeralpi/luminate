import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { challengeStore } from "@/lib/redis";
import crypto from 'crypto';
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const authRouter = router({
    getChallenge: publicProcedure
        .input(z.object({
            walletAddress: z.string().regex(/^G[A-Z0-9]{55}$/, "Invalid Stellar address"),
        }))
        .mutation(async ({ input }) => {
            const { walletAddress } = input;

            const challenge = crypto.randomBytes(32).toString('hex');

            await challengeStore.set(walletAddress, challenge);

            return {
                challenge,
                message: `Please sign this message to authenticate:\n\nChallenge: ${challenge}\nWebsite: ${process.env.NEXT_PUBLIC_APP_URL || 'localhost'}`
            };
        }),

    authenticate: publicProcedure
        .input(z.object({
            walletAddress: z.string().regex(/^G[A-Z0-9]{55}$/),
            signerAddress: z.string().regex(/^G[A-Z0-9]{55}$/),
            challenge: z.string(),
        }))
        .mutation(async ({ input }) => {
            const { walletAddress, signerAddress, challenge } = input;

            if (walletAddress !== signerAddress) {
                throw new Error("Signer address does not match wallet address");
            }

            const storedData = await challengeStore.get(walletAddress);

            if (!storedData || storedData.challenge !== challenge) {
                throw new Error("Invalid or expired challenge");
            }

            await challengeStore.delete(walletAddress);

            let user = await db.query.users.findFirst({
                where: eq(users.walletAddress, walletAddress),
            });

            if (!user) {
                [user] = await db.insert(users).values({
                    walletAddress,
                }).returning();
            }

            // Session oluştur
            const session = await lucia.createSession(user.id.toString(), {});
            const sessionCookie = lucia.createSessionCookie(session.id);

            (await cookies()).set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            );

            return {
                success: true,
                user: {
                    id: user.id,
                    walletAddress: user.walletAddress,
                }
            };
        }),

    disconnect: publicProcedure
        .mutation(async () => {
            const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;

            if (!sessionId) {
                return { success: false };
            }

            await lucia.invalidateSession(sessionId);

            const sessionCookie = lucia.createBlankSessionCookie();
            (await cookies()).set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            );

            return { success: true };
        }),

    getSession: publicProcedure
        .query(async () => {
            const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;

            if (!sessionId) {
                return { user: null };
            }

            const { session, user } = await lucia.validateSession(sessionId);

            if (!session || !user) {
                return { user: null };
            }

            const dbUser = await db.query.users.findFirst({
                where: eq(users.id, Number(user.id)),
            });

            return {
                user: dbUser ? {
                    id: dbUser.id,
                    walletAddress: dbUser.walletAddress,
                } : null
            };
        }),
});