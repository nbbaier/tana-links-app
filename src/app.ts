import { getLinks } from "./db/queries";
import type { TanaLink } from "./types";
import { upsertLinkMapping } from "./db/queries";
import {
  extractUniqueHostnames,
  findWWWDomains,
  filterMatchingPairs,
} from "./utils";
import { linkMappingsTable } from "./db/schema";
import { getTableName } from "drizzle-orm";
import { db } from "./db/db";

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
