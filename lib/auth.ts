import { Lucia } from "lucia";

import { NodePostgresAdapter } from "@lucia-auth/adapter-postgresql";

import { pool } from "./db";

export const adapter = new NodePostgresAdapter(pool, {
    session: "sessions",
    user: "users",
})

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        name: "luminate_session_id",
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === "production",
        },
    },
    getUserAttributes: (attributes) => {
        return {
            walletAddress: attributes.wallet_address,
            avatar: attributes.avatar,
            name: attributes.name,
        };
    },
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: {
            wallet_address: string;
            avatar: string;
            name: string;
        };
    }
}