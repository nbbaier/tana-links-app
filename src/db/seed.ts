import type { VTLink } from "../types";
import { sqlToJSON } from "../utils";
import { db } from "./db";
import { linksTable, type InsertLink } from "./schema";

/**
 * Retrieves VTLinks from the database.
 * @param limit - The maximum number of VTLinks to retrieve.
 * @returns A promise that resolves to an array of VTLinks.
 * @throws If there is an error fetching the VTLinks.
 */
async function getVTLinks(limit?: number): Promise<VTLink[]> {
	const limitConstraint = limit ? `limit ${limit}` : "";

	try {
		const res = await fetch("https://api.val.town/v1/sqlite/execute", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.VALTOWN}`,
			},
			body: JSON.stringify({
				statement: `select * from tana_links order by random() ${limitConstraint};`,
			}),
		});

		if (!res.ok) {
			throw new Error(`${res.status} ${res.statusText}`);
		}

		const jsonResponse = await res.json();
		const data = sqlToJSON(jsonResponse) as VTLink[];

		return data;
	} catch (error) {
		throw new Error(
			`Error fetching VT links: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

async function seedLinks(limit = 1000) {
	console.log("Fetching data from val.town");

	let data: VTLink[] = [];

	try {
		data = await getVTLinks(limit);
	} catch (error) {
		console.error(error);
	}

	console.log("Seeding links");

	for (const item of data) {
		const newRow: InsertLink = {
			vtid: item.id,
			link_id: item.link_id,
			link_url: item.link_url,
			saved_datetime: item.saved_datetime,
			saved_timestamp: new Date(item.saved_timestamp),
			created_at: item.created_at,
			updated_at: item.updated_at,
		};
		await db.insert(linksTable).values(newRow);
	}
}

await db.delete(linksTable);
await seedLinks(2000);
