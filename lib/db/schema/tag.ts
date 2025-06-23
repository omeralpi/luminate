import { postTags } from "@/lib/db/schema/post-tag";
import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const tags = pgTable("tags", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).unique().notNull(),
    color: varchar("color", { length: 50 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tagsRelations = relations(tags, ({ many }) => ({
    postTags: many(postTags),
})); 