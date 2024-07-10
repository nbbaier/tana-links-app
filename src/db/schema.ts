import { Table, sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  blob,
  primaryKey,
  foreignKey,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const linksTable = sqliteTable(
  "tana_links",
  {
    id: integer("id"),
    vtid: integer("vtid").notNull(),
    link_id: text("link_id").notNull(),
    link_url: text("link_url").notNull(),
    saved_datetime: text("saved_datetime").notNull(),
    saved_timestamp: integer("saved_timestamp", {
      mode: "timestamp",
    }).notNull(),
    created_at: text("created_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
    updated_at: text("updated_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: "customName",
        columns: [table.id, table.link_id],
      }),
      linkIdx: uniqueIndex("link_idx").on(table.link_id),
    };
  }
);

export const normedLinkTable = sqliteTable(
  "normed_tana_links",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    tana_links_id: integer("tana_links_id").notNull(),
    link_id: text("link_id").notNull(),
    raw_link_url: text("link_url").notNull(),
    normed_link_url: text("normed_link_url").notNull(),
  },
  (table) => ({
    fk: foreignKey({
      columns: [table.tana_links_id, table.link_id],
      foreignColumns: [linksTable.id, linksTable.link_id],
      name: "fk_normalized_link",
    }),
    nromedIdx: uniqueIndex("normed_idx").on(table.tana_links_id, table.link_id),
  })
);

export const linkMappingsTable = sqliteTable("link_mappings", {
  id: integer("id").primaryKey(),
  mappings: blob("mappings", { mode: "json" })
    .$type<
      {
        in_url: string;
        out_url: string;
      }[]
    >()
    .notNull()
    .unique(),
});

export type InsertLink = typeof linksTable.$inferInsert;
export type SelectLink = typeof linksTable.$inferSelect;

export type InsertNormedLink = typeof normedLinkTable.$inferInsert;
export type SelectNormedLink = typeof normedLinkTable.$inferSelect;

export type InsertLinkMapping = typeof linkMappingsTable.$inferInsert;
export type SelectLinkMapping = typeof linkMappingsTable.$inferSelect;
