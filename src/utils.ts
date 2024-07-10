import type { TanaLink, DomainPair } from "./types";

export function extractUniqueHostnames(rows: TanaLink[]): string[] {
  const uniqueHosts = new Set(
    rows.map((row) => new URL(row.link_url).hostname)
  );
  return Array.from(uniqueHosts);
}
export function findWWWDomains(urls: string[]): DomainPair[] {
  return urls
    .filter((url) => url.startsWith("www"))
    .map((url) => ({
      in_url: url.replace(/^www\./, ""),
      out_url: url,
    }));
}
export function filterMatchingPairs(
  domains: DomainPair[],
  allUrls: string[]
): DomainPair[] {
  return domains.filter(
    (domain) =>
      allUrls.includes(domain.out_url) && allUrls.includes(domain.in_url)
  );
}

export function mergeMappings(
  newMappings: {
    in_url: string;
    out_url: string;
  }[],
  existingMappings: {
    in_url: string;
    out_url: string;
  }[]
) {
  return newMappings.concat(
    existingMappings.filter(
      (item2) =>
        !newMappings.some(
          (item1) =>
            item1.in_url === item2.in_url && item1.out_url === item2.out_url
        )
    )
  );
}

export const foo = "bar";
