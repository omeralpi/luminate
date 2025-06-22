import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { userAchievements } from "./achievement";
import { userReadPosts } from "./user-read-post";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  avatar: text("avatar"),
  location: text("location"),
  name: text("name").default("Anonymous User").notNull(),
  shareCount: integer("share_count").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const usersRelations = relations(users, ({ many }) => ({
  achievements: many(userAchievements),
  readPosts: many(userReadPosts),
}))

export type User = typeof users.$inferSelect