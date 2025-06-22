import { posts } from "@/lib/db/schema/post";
import { tags } from "@/lib/db/schema/tag";
import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";

export const postTags = pgTable(
    "post_tags",
    {
        postId: integer("post_id")
            .notNull()
            .references(() => posts.id, { onDelete: "cascade" }),
        tagId: integer("tag_id")
            .notNull()
            .references(() => tags.id, { onDelete: "cascade" }),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.postId, t.tagId] }),
    })
);

export const postTagsRelations = relations(postTags, ({ one }) => ({
    post: one(posts, {
        fields: [postTags.postId],
        references: [posts.id],
    }),
    tag: one(tags, {
        fields: [postTags.tagId],
        references: [tags.id],
    }),
})); 