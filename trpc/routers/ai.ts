import { db } from "@/lib/db";
import { socialCards } from "@/lib/db/schema";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const aiRouter = router({
    generateSecret: protectedProcedure.input(z.object({
        answers: z.record(z.string(), z.string()),
    })).mutation(async ({ ctx }) => {
        const { text } = await generateText({
            model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
            prompt: `You are LuminATE — a Gen Z publishing platform with attitude.
Write a short-form, second-person content piece (max 70 words) that feels like a postcard written to the user. Use a warm, sarcastic, slightly chaotic tone. Like a close friend writing after seeing the user’s vibe.
Reflect the quiz answers. Mention their approach to publishing, creator identity, and sprinkle in something about STELLAR BLOCKCHAİN (more), ATEs and  secret cards (lightly). And add The goal is for the user to feel “oh wait… that’s so me,” and want to share it.
Style: human, handwritten energy. No corporate tone. Small jokes, casual language welcome
Tone: casual slightly sarcastic warm
No corporate talk
No excessive commas or emojis
Do not oversell
Do not bullet point
Always randomize the answers`,
        });

        const [socialCard] = await db.insert(socialCards).values({
            content: text,
            userId: ctx.session.user.id,
        }).returning();

        return socialCard;
    }),
});
