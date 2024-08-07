import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const url = process.env.TURSO_DB_URL; // ?? "";
const authToken = process.env.TURSO_DB_TOKEN; // ?? "";

const client = createClient({
	url,
	authToken,
});
export const db = drizzle(client);
