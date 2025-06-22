import { relations } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./user";

export const ipfsStatusEnum = pgEnum('ipfs_status', ['pending', 'uploaded', 'failed']);

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subTitle: text("sub_title"),
  content: text("content").notNull(),
  cover: text("cover"),
  userId: integer("user_id").references(() => users.id).notNull(),

  ipfsStatus: ipfsStatusEnum('ipfs_status').default('pending'),
  ipfsHash: varchar('ipfs_hash', { length: 100 }),
  gatewayUrl: text('gateway_url'),
  ipfsError: text('ipfs_error'),
  ipfsRetryCount: integer('ipfs_retry_count').default(0),
  ipfsUploadedAt: timestamp('ipfs_uploaded_at'),

  nftMinted: boolean('nft_minted').default(false),
  nftTransactionHash: text('nft_transaction_hash'),
  nftMintedAt: timestamp('nft_minted_at'),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}))

export type Post = typeof posts.$inferSelect

export type PostWithUser = typeof posts.$inferSelect & {
  user: typeof users.$inferSelect
}
