import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const url = process.env?.TURSO_TANA_LINKS_URL ?? "";
const authToken = process.env.TURSO_TANA_LINKS_TOKEN ?? "";

const client = createClient({
	url,
	authToken,
});
export const db = drizzle(client);
