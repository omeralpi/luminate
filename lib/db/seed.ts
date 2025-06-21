import "dotenv/config"

import { reset } from "drizzle-seed"

import { db } from "."
import * as schema from "./schema"

async function main() {
  await reset(db, schema)

  const [user] = await db.insert(schema.users).values({
    walletAddress: "GABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  }).returning()

  await db.insert(schema.posts).values({
    title: "Hello World",
    content: "You can find video version of this article here. In the previous article, we covered the key aspects of Swift Concurrency to build a solid mental model of it. In this article, we will discuss You can find video version of this article here. In the previous article, we covered the key aspects of Swift Concurrency to build a solid mental model of it. In this article, we will discuss",
    cover: 'https://files.risein.com/bootcamps/hack-pera/xok4c-cohorts-coverpng',
    userId: user.id,
  });
}

main()
