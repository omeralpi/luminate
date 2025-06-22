import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, serial, timestamp, unique } from "drizzle-orm/pg-core";
import { users } from "./user";

export const achievementTypeEnum = pgEnum('achievement_type', ['new', 'genius', 'ten', 'degen']);

export const userAchievements = pgTable("user_achievements", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id).notNull(),
    type: achievementTypeEnum('type').notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => ({
    unq: unique().on(t.userId, t.type),
}))

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
    user: one(users, {
        fields: [userAchievements.userId],
        references: [users.id],
    }),
})) 