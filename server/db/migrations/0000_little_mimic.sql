CREATE TABLE `accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`wallet_id` integer NOT NULL,
	`xpub` text NOT NULL,
	`fingerprint` text DEFAULT '00000000' NOT NULL,
	`derivation_path` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`wallet_id`) REFERENCES `wallets`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `address_stats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`address_id` integer NOT NULL,
	`spent_txo_count` integer NOT NULL,
	`spent_txo_sum` real NOT NULL,
	`funded_txo_count` integer NOT NULL,
	`funded_txo_sum` real NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`address_id`) REFERENCES `address`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `address` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`account_id` integer NOT NULL,
	`address_type` integer NOT NULL,
	`address_index` integer NOT NULL,
	`address` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `wallets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`script_type` text NOT NULL,
	`passphrase_protected` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_xpub_unique` ON `accounts` (`xpub`);--> statement-breakpoint
CREATE UNIQUE INDEX `address_address_unique` ON `address` (`address`);