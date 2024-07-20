import { mergeMappings } from "../src/utils";
import { upsertLinkMapping } from "../src/db/queries";
import { expect, test, describe } from "bun:test";
import { db } from "../src/db/db";
import { linkMappingsTable } from "../src/db/schema";

const oldMappings = [
	{
		in_url: "youtube.com",
		out_url: "www.youtube.com",
	},
	{
		in_url: "umlboard.com",
		out_url: "www.umlboard.com",
	},
	{
		in_url: "evchapman.com",
		out_url: "www.evchapman.com",
	},
	{
		in_url: "typehero.dev",
		out_url: "www.typehero.dev",
	},
	{
		in_url: "alexanderweichart.de",
		out_url: "www.alexanderweichart.de",
	},
	{
		in_url: "www2.fossil-scm.org",
		out_url: "www2.fossil-scm.org",
	},
	{
		in_url: "together.ai",
		out_url: "www.together.ai",
	},
	{
		in_url: "matuzo.at",
		out_url: "www.matuzo.at",
	},
	{
		in_url: "sofahq.com",
		out_url: "www.sofahq.com",
	},
	{
		in_url: "visakanv.com",
		out_url: "www.visakanv.com",
	},
	{
		in_url: "kitsonkelly.com",
		out_url: "www.kitsonkelly.com",
	},
	{
		in_url: "karelvo.com",
		out_url: "www.karelvo.com",
	},
	{
		in_url: "craftinginterpreters.com",
		out_url: "www.craftinginterpreters.com",
	},
	{
		in_url: "unixdigest.com",
		out_url: "www.unixdigest.com",
	},
	{
		in_url: "beyondloom.com",
		out_url: "www.beyondloom.com",
	},
	{
		in_url: "martinfowler.com",
		out_url: "www.martinfowler.com",
	},
	{
		in_url: "www-formal.stanford.edu",
		out_url: "www-formal.stanford.edu",
	},
	{
		in_url: "ntietz.com",
		out_url: "www.ntietz.com",
	},
];

const newMappings = [{ in_url: "youtu.be", out_url: "www.youtube.com" }];

test("mergeMappings length", () => {
	const result = mergeMappings(newMappings, oldMappings);
	expect(result.length).toEqual(oldMappings.length + newMappings.length);
});

test("insert into empty table", async () => {
	await db.delete(linkMappingsTable);
	const result = await upsertLinkMapping({ mappings: oldMappings });
	expect(result[0].mappings).toEqual(oldMappings);
});

test("get current mappings from empty table", async () => {
	await db.delete(linkMappingsTable);
	const res = await db.select().from(linkMappingsTable);
	const existingMappings = res[0]?.mappings;
	expect(existingMappings).toBeUndefined();
});

test("get current mappings from table", async () => {
	await db.delete(linkMappingsTable);
	await db.insert(linkMappingsTable).values({ id: 1, mappings: oldMappings });
	const res = await db.select().from(linkMappingsTable);
	const existingMappings = res[0]?.mappings;
	expect(existingMappings).toEqual(oldMappings);
});

test("insert into table with rows", async () => {
	await db.delete(linkMappingsTable);
	const firstResult = await upsertLinkMapping({ mappings: oldMappings });
	const secondResult = await upsertLinkMapping({ mappings: newMappings });
	expect(secondResult[0].mappings.length).toEqual(
		oldMappings.length + newMappings.length,
	);
});
