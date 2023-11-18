CREATE TABLE `accounts` (
	`wallet_id` text NOT NULL,
	`index` integer DEFAULT 0 NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`index`, `wallet_id`),
	FOREIGN KEY (`wallet_id`) REFERENCES `wallets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `wallets` (
	`id` text PRIMARY KEY NOT NULL,
	`xpub` text NOT NULL,
	`derivation_path` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`script_type` text NOT NULL,
	`passphrase_protected` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wallets_xpub_unique` ON `wallets` (`xpub`);