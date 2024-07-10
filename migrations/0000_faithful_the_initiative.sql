CREATE TABLE `link_mappings` (
	`id` integer PRIMARY KEY NOT NULL,
	`mappings` blob NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tana_links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vtid` integer NOT NULL,
	`link_id` text NOT NULL,
	`link_url` text NOT NULL,
	`saved_datetime` text NOT NULL,
	`saved_timestamp` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `link_mappings_mappings_unique` ON `link_mappings` (`mappings`);
--> statement-breakpoint
CREATE UNIQUE INDEX `link_idx` ON `tana_links` (`link_id`, `link_id`);