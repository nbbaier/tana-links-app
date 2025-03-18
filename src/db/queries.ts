import { mergeMappings } from "../utils";
import { db } from "./db.ts";
import {
	linkMappingsTable,
	linksTable,
	type InsertLinkMapping,
	type SelectLink,
} from "./schema";

/**
 * Retrieves all links from the database.
 * @returns A promise that resolves to an array of SelectLink objects.
 */
export const getAllLinks = async (): Promise<SelectLink[]> =>
	db.select().from(linksTable);

export const getLinks = async (limit: number): Promise<SelectLink[]> =>
	db.select().from(linksTable).limit(limit);

export const getLinkMappings = async () => db.select().from(linkMappingsTable);

/**
 * Upserts a link mapping into the database.
 *
 * @param linkMapping - The link mapping to be upserted.
 * @returns A promise that resolves with the result of the upsert operation.
 */
export const upsertLinkMapping = async (linkMapping: InsertLinkMapping) => {
	const { mappings: newMappings } = linkMapping;
	const res = await db.select().from(linkMappingsTable);
	const existingMappings = res[0]?.mappings;
	const mergedMappings = mergeMappings(newMappings, existingMappings || []);
	return db
		.insert(linkMappingsTable)
		.values({ id: 1, mappings: mergedMappings })
		.onConflictDoUpdate({
			target: linkMappingsTable.id,
			set: { mappings: mergedMappings },
		})
		.returning();
};
