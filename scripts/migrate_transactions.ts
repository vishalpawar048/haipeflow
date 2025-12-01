import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  try {
    console.log("Checking/Creating 'transactions' table...");

    const client = await pool.connect();
    try {
      // Check if table exists
      const checkRes = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name='transactions';
        `);

      if (checkRes.rows.length === 0) {
        console.log("Creating 'transactions' table...");
        await client.query(`
                CREATE TABLE "transactions" (
                    "id" SERIAL PRIMARY KEY,
                    "user_id" TEXT NOT NULL,
                    "order_id" TEXT NOT NULL UNIQUE,
                    "payment_session_id" TEXT,
                    "amount" DOUBLE PRECISION NOT NULL,
                    "currency" TEXT DEFAULT 'INR',
                    "credits" INTEGER NOT NULL,
                    "status" TEXT DEFAULT 'PENDING',
                    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            `);
        console.log("Successfully created 'transactions' table.");
      } else {
        console.log("'transactions' table already exists.");
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

