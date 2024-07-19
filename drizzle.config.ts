import { defineConfig } from "drizzle-kit";

const url = Bun.env.TURSO_TANA_LINKS_URL;
const authToken = Bun.env.TURSO_TANA_LINKS_TOKEN;

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
