import { defineConfig } from "drizzle-kit";

const url = process.env.TURSO_DB_URL;
const authToken = process.env.TURSO_DB_TOKEN;

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./migrations",
	dialect: "sqlite",
	driver: "turso",
	dbCredentials: {
		url,
		authToken,
	},
});
