CREATE TABLE `link_mappings` (
	`mappings` blob NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tana_links` (
	`id` integer,
	`vtid` integer NOT NULL,
	`link_id` text NOT NULL,
	`link_url` text NOT NULL,
	`saved_datetime` text NOT NULL,
	`saved_timestamp` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	PRIMARY KEY(`id`, `link_id`)
);
--> statement-breakpoint
CREATE TABLE `normed_tana_links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tana_links_id` integer NOT NULL,
	`link_id` text NOT NULL,
	`link_url` text NOT NULL,
	`normed_link_url` text NOT NULL,
	FOREIGN KEY (`tana_links_id`,`link_id`) REFERENCES `tana_links`(`id`,`link_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `link_idx` ON `tana_links` (`link_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `normed_idx` ON `normed_tana_links` (`tana_links_id`,`link_id`);