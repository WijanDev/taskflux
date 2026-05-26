CREATE TABLE `user_role` (
	`user_id` text PRIMARY KEY NOT NULL,
	`role` text NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_role_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	`effective_at` integer NOT NULL,
	`changed_by_user_id` text,
	`note` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`changed_by_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `user_role_history_user_id_idx` ON `user_role_history` (`user_id`);
--> statement-breakpoint
INSERT INTO `user_role` (`user_id`, `role`, `updated_at`)
SELECT `id`, 'admin', `created_at` FROM `user`;
--> statement-breakpoint
INSERT INTO `user_role_history` (`user_id`, `role`, `effective_at`, `changed_by_user_id`, `note`)
SELECT
	`id`,
	'admin',
	`created_at`,
	NULL,
	'Initial migration: existing users granted admin'
FROM `user`;
