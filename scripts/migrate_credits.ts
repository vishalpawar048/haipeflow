import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  try {
    console.log("Checking 'user' table for 'credits' column...");

    const client = await pool.connect();
    try {
      // Check if column exists
      const checkRes = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='user' AND column_name='credits';
        `);

      if (checkRes.rows.length === 0) {
        console.log("Adding 'credits' column to 'user' table...");
        await client.query(`
                ALTER TABLE "user" 
                ADD COLUMN "credits" DOUBLE PRECISION DEFAULT 100 NOT NULL;
            `);
        console.log("Successfully added 'credits' column.");
      } else {
        console.log("'credits' column already exists.");
      }
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
