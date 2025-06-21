import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { users } from "./user"

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    mode: "date",
  }).notNull(),
})
