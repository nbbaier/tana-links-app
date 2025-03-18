import { parse } from "tldts";
import urlMetadata from "url-metadata";
import data from "./domains.json" with { type: "json" };
import normalizeUrl from "normalize-url";
import { deadOrAlive } from "dead-or-alive";

const domains = [
	...new Set(
		[...Object.values(data)]
			.sort(() => Math.random() - 0.5)
			.slice(0, 10)
			.flat()
			.filter((x) => ["www", ""].includes(x.subdomain))
			.flatMap((x) => {
				if (x.subdomain === "" || x.subdomain === "www") {
					return [`https://${x.domain}`, `https://www.${x.domain}`];
				}
				return `https://${x.hostname}`;
			}),
	),
];

for (const domain of domains) {
	try {
		const { url, status, messages } = await deadOrAlive(domain);
		const prefix = domain.startsWith("https://www.")
			? `${domain} |`
			: `${domain}     |`;
		console.log(prefix, url, "|", status, "|", messages);
		// const metadata = await urlMetadata(domain);
		// console.log({
		// 	domain,
		// 	url: metadata.url,
		// 	canonical: metadata.canonical,
		// });
	} catch (error) {
		console.error(domain, (error as Error).message);
	}
}
