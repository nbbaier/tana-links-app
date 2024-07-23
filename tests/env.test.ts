import { expect, test } from "bun:test";

test("test environment url correct", () => {
	expect(process.env.TURSO_DB_URL).toBe("file:./local.db");
});
