import { neon } from "@neondatabase/serverless";

// DATABASE_URL comes from your Vercel/Neon environment variables.
export const sql = neon(process.env.DATABASE_URL);
