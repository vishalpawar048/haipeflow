import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const auth = betterAuth({
    database: pool,
    user: {
        additionalFields: {
            credits: {
                type: "number",
                defaultValue: 100,
            },
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    session: {
        expiresIn: 60 * 60 * 24 * 365, // 1 year
        updateAge: 60 * 60 * 24, // 1 day
    },
});
