import { linkMappingsTable } from "./src/db/schema";
import domains from "./domains";

const batchSize = 1;
const timeout = 3000; // 5 second timeout

const fetchWithTimeout = async (url: string, timeoutMs: number) => {
	const controller = new AbortController();

	const timeoutPromise = new Promise((_, reject) => {
		setTimeout(() => {
			controller.abort();
			reject(new Error("TimeoutError"));
		}, timeoutMs);
	});

	try {
		const fetchPromise = fetch(url, {
			method: "GET",
			redirect: "manual",
			signal: controller.signal,
			headers: {
				accept: "*/*",
			},
		});

		const response = await Promise.race([fetchPromise, timeoutPromise]);
		return response;
	} catch (error) {
		if (error instanceof Error && error.name === "AbortError") {
			console.error(`Timeout fetching ${url}`);
		} else {
			console.error(`Error fetching ${url}:`, (error as Error).message);
		}
		return null;
	}
};

const testDomains = async (domains: string[]) => {
	const urls = domains.flatMap((url) => [
		url.replace("https://", "https://www."),
		url,
	]);

	for (let i = 0; i < urls.length; i += batchSize) {
		const batch = urls.slice(i, i + batchSize);

		const responses = await Promise.allSettled(
			batch.map((url) => fetchWithTimeout(url, timeout)),
		);

		for (let j = 0; j < responses.length; j++) {
			const result = responses[j];
			const url = batch[j];

			if (result.status === "fulfilled" && result.value) {
				const res = result.value as Response;
				res.headers.get("location")
					? console.log(res.status, "|", url, "=>", res.headers.get("location"))
					: console.log(res.status, "|", url);
			}
		}
	}
};

testDomains([...domains].sort(() => Math.random() - 0.5).slice(0, 20));
