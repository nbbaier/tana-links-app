import { db } from "./db/db.ts";
import { getLinks, upsertLinkMapping } from "./db/queries";
import { linkMappingsTable } from "./db/schema";
import type { TanaLink } from "./types";
import {
	extractUniqueHostnames,
	filterMatchingPairs,
	findWWWDomains,
} from "./utils";
import normalizeUrl from "normalize-url";

const results = (await getLinks.execute()) as TanaLink[];

const uniqueHosts = extractUniqueHostnames(results);
const wwwDomains = findWWWDomains(uniqueHosts);
const matchingPairs = filterMatchingPairs(wwwDomains, uniqueHosts);

try {
	await upsertLinkMapping({
		mappings: matchingPairs,
	});
} catch (error) {
	console.log(error);
}

console.log((await db.select().from(linkMappingsTable))[0].mappings);
