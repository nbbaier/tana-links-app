import type { ResultSet, Value } from "@libsql/client";
import { getAllLinks } from "./db/queries";
import type { DomainPair, TanaLink } from "./types";

/**
 * Extracts unique hostnames from an array of TanaLink objects.
 *
 * @param rows - An array of TanaLink objects.
 * @returns An array of unique hostnames extracted from the link URLs.
 */
export function extractUniqueHostnames(
	rows: ({ link_url: string } | TanaLink)[],
): string[] {
	const uniqueHosts = new Set(
		rows.map((row) => new URL(row.link_url).hostname),
	);
	return Array.from(uniqueHosts);
}

/**
 * Finds the WWW domains in a given array of URLs.
 *
 * @param urls - An array of URLs to search for WWW domains.
 * @returns An array of `DomainPair` objects, where each object contains the input URL without the "www" prefix and the original URL.
 */
export function findWWWDomains(urls: string[]): DomainPair[] {
	return urls
		.filter((url) => url.startsWith("www"))
		.map((url) => ({
			in_url: url.replace(/^www\./, ""),
			out_url: url,
		}));
}

/**
 * Filters an array of `DomainPair` objects based on whether both the `out_url` and `in_url` properties
 * exist in the `allUrls` array.
 *
 * @param domains - An array of `DomainPair` objects to filter.
 * @param allUrls - An array of all URLs to check against.
 * @returns An array of `DomainPair` objects that have both `out_url` and `in_url` properties present in `allUrls`.
 */
export function filterMatchingPairs(
	domains: DomainPair[],
	allUrls: string[],
): DomainPair[] {
	return domains.filter(
		(domain) =>
			allUrls.includes(domain.out_url) && allUrls.includes(domain.in_url),
	);
}

/**
 * Merges two arrays of mappings, combining new mappings with existing mappings.
 * @param newMappings - An array of new mappings.
 * @param existingMappings - An array of existing mappings.
 * @returns An array containing the merged mappings.
 */
export function mergeMappings(
	newMappings: {
		in_url: string;
		out_url: string;
	}[],
	existingMappings: {
		in_url: string;
		out_url: string;
	}[],
) {
	return newMappings.concat(
		existingMappings.filter(
			(item2) =>
				!newMappings.some(
					(item1) =>
						item1.in_url === item2.in_url && item1.out_url === item2.out_url,
				),
		),
	);
}

/**
 * Converts the result of an SQL query to a JSON array.
 * @param sqlResult The result of the SQL query.
 * @returns An array of JSON objects representing the rows of the result.
 */
export const sqlToJSON = (sqlResult: ResultSet) => {
	const { columns, rows } = sqlResult;

	return rows.map((row) =>
		columns.reduce(
			(obj, col, index) => {
				obj[col] = row[index];
				return obj;
			},
			{} as { [key: string]: Value },
		),
	);
};

/**
 * Retrieves a grouped list of duplicate URLs based on their hostname.
 * @returns A promise that resolves to an object containing the grouped duplicate URLs.
 */
export async function getGroupedDuplicateURLs(): Promise<{
	[x: string]: { count: number; urls: string[] };
}> {
	const links = await getAllLinks();
	const urlsGroupedByHostname = links.reduce(
		(
			acc: { [hostname: string]: { count: number; urls: string[] } },
			currentLink,
		) => {
			const hostname = new URL(currentLink.link_url).hostname;
			if (!acc[hostname]) {
				acc[hostname] = { count: 0, urls: [] };
			}
			acc[hostname].count += 1;
			acc[hostname].urls.push(currentLink.link_url);
			return acc;
		},
		{},
	);

	return urlsGroupedByHostname;
}
