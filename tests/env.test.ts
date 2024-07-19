import { expect, test, describe } from "bun:test";
import { db } from "../src/db/db";
import { linksTable } from "../src/db/schema";
import { count, sql } from "drizzle-orm";

test("test environment url correct", () => {
	expect(Bun.env.TURSO_TANA_LINKS_URL).toBe("file:local.db");
});
