CREATE TABLE `link_mappings` (
	`id` integer PRIMARY KEY NOT NULL,
	`mappings` blob NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `link_mappings_mappings_unique` ON `link_mappings` (`mappings`);