CREATE TABLE `address_stats` (
	`id` integer PRIMARY KEY NOT NULL,
	`address_id` integer NOT NULL,
	`balance` real NOT NULL,
	`spent_txo_count` integer NOT NULL,
	`spent_txo_sum` real NOT NULL,
	`funded_txo_count` integer NOT NULL,
	`funded_txo_sum` real NOT NULL,
	`tx_count` integer NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`address_id`) REFERENCES `address`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `address` (
	`id` integer PRIMARY KEY NOT NULL,
	`account_id` integer NOT NULL,
	`address_type` integer NOT NULL,
	`address_index` integer NOT NULL,
	`address` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
/*
You're trying to delete PRIMARY KEY(index,wallet_id) from 'accounts' table
SQLite does not supportprimary key deletion from existing table
You can do it in 3 steps with drizzle orm:
 - create new mirror table table without pk, rename current table to old_table, generate SQL
 - migrate old data from one table to another
 - delete old_table in schema, generate sql

or create manual migration like below:

ALTER TABLE table_name RENAME TO old_table;
CREATE TABLE table_name (
	column1 datatype [ NULL | NOT NULL ],
	column2 datatype [ NULL | NOT NULL ],
	...
	PRIMARY KEY (pk_col1, pk_col2, ... pk_col_n)
 );
INSERT INTO table_name SELECT * FROM old_table;

Due to that we don't generate migration automatically and it has to be done manually
*/
--> statement-breakpoint
DROP INDEX IF EXISTS `wallets_xpub_unique`;--> statement-breakpoint
ALTER TABLE accounts ADD `id` integer PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE accounts ADD `xpub` text NOT NULL;--> statement-breakpoint
ALTER TABLE accounts ADD `fingerprint` text DEFAULT '00000000' NOT NULL;--> statement-breakpoint
ALTER TABLE accounts ADD `derivation_path` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `address_address_unique` ON `address` (`address`);--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_xpub_unique` ON `accounts` (`xpub`);--> statement-breakpoint
ALTER TABLE `accounts` DROP COLUMN `index`;--> statement-breakpoint
ALTER TABLE `wallets` DROP COLUMN `xpub`;--> statement-breakpoint
ALTER TABLE `wallets` DROP COLUMN `derivation_path`;--> statement-breakpoint
ALTER TABLE `wallets` DROP COLUMN `script_type`;