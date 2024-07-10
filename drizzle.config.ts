import { defineConfig } from "drizzle-kit";

const url = process.env.TURSO_TANA_LINKS_URL!;
const authToken = process.env.TURSO_TANA_LINKS_TOKEN!;

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
