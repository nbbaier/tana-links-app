import { getLinks, upsertLinkMapping } from "./db/queries";
import {
	extractUniqueHostnames,
	filterMatchingPairs,
	findWWWDomains,
} from "./utils";

const links = await getLinks();
const uniqueHosts = extractUniqueHostnames(links);
const wwwDomains = findWWWDomains(uniqueHosts);
const matchingPairs = filterMatchingPairs(wwwDomains, uniqueHosts);

try {
	await upsertLinkMapping({
		mappings: matchingPairs,
	});
} catch (error) {
	console.log(error);
}
