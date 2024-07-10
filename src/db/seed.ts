import { linksTable, type InsertLink } from "./schema";
import { db } from "./db";
import type { ResultSet } from "@libsql/client";

const sqlToJSON = (result: ResultSet) => {
  const { columns, rows } = result;

  return rows.map((row) =>
    columns.reduce((obj, col, index) => {
      obj[col] = row[index];
      return obj;
    }, {} as { [key: string]: any })
  );
};

async function getVTLinks(limit?: number) {
  const limitConstraint = limit ? `limit ${limit}` : "";

  const res = await fetch("https://api.val.town/v1/sqlite/execute", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VALTOWN}`,
    },
    body: JSON.stringify({
      statement: `select * from tana_links ${limitConstraint};`,
    }),
  });

  if (!res.ok) throw new Error("Failed to fetch data from val.town");

  const data = sqlToJSON(await res.json()) as {
    id: number;
    link_id: string;
    link_url: string;
    saved_datetime: string;
    saved_timestamp: number;
    created_at: string;
    updated_at: string;
  }[];

  return data;
}

async function seedLinks(limit?: number) {
  console.log("Fetching data from val.town");

  let data = await getVTLinks(limit);

  console.log("Seeding links");

  for (const item of data) {
    const newRow: InsertLink = {
      vtid: item.id,
      link_id: item.link_id,
      link_url: item.link_url,
      saved_datetime: item.saved_datetime,
      saved_timestamp: new Date(item.saved_timestamp),
      created_at: item.created_at,
      updated_at: item.updated_at,
    };
    await db.insert(linksTable).values(newRow);
  }
}

await db.delete(linksTable);
await seedLinks();
