import { db } from "./db";
import { linksTable } from "./schema";
import { extractUniqueHostnames } from "../utils";
import { parse } from "tldts";

const links = await db
	.select({ link_url: linksTable.link_url })
	.from(linksTable);
const uniqueHosts = extractUniqueHostnames(links);
const parsedLinks = uniqueHosts.map((link) => {
	const { hostname, domain, subdomain } = parse(link);
	return { hostname, domain, subdomain };
});
const groupedByDomain = Object.groupBy(
	parsedLinks,
	({ domain }) => domain ?? "unknown",
);

await Bun.write(
	"domains.json",
	JSON.stringify(
		Object.fromEntries(
			Object.entries(groupedByDomain).filter(
				([_, values = []]) =>
					values.length >= 1 &&
					values.some(({ subdomain }) => subdomain === "www"),
			),
		),
	),
);
