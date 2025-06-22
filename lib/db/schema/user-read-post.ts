import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey, timestamp } from "drizzle-orm/pg-core";
import { posts } from "./post";
import { users } from "./user";

export const userReadPosts = pgTable("user_read_posts", {
    userId: integer("user_id").notNull().references(() => users.id),
    postId: integer("post_id").notNull().references(() => posts.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
},
    (table) => {
        return {
            pk: primaryKey({ columns: [table.userId, table.postId] }),
        }
    }
);

export const userReadPostsRelations = relations(userReadPosts, ({ one }) => ({
    user: one(users, {
        fields: [userReadPosts.userId],
        references: [users.id],
    }),
    post: one(posts, {
        fields: [userReadPosts.postId],
        references: [posts.id],
    }),
}));

export type UserReadPost = typeof userReadPosts.$inferSelect; 