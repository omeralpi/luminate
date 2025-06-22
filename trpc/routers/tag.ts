import { db } from "@/lib/db";
import { postTags, tags } from "@/lib/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const tagRouter = router({
    getHotTopics: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(50).default(10),
            })
        )
        .query(async ({ input }) => {
            const { limit } = input;

            const hotTopics = await db
                .select({
                    id: tags.id,
                    name: tags.name,
                    color: tags.color,
                    postCount: sql<number>`count(${postTags.postId})`.mapWith(Number),
                })
                .from(tags)
                .leftJoin(postTags, eq(tags.id, postTags.tagId))
                .groupBy(tags.id, tags.name, tags.color)
                .orderBy(desc(sql`count(${postTags.postId})`))
                .limit(limit);

            return hotTopics.filter((topic) => topic.postCount > 0);
        }),
}); 