import { db } from "./db.ts";
import {
	type InsertLink,
	type SelectLink,
	linksTable,
	linkMappingsTable,
	type InsertLinkMapping,
	type SelectLinkMapping,
} from "./schema";
import type { TanaLink } from "../types";
import { mergeMappings } from "../utils";

export const getLinks = db.select().from(linksTable);

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
