-- Step 1: audit columns nullable (recreate table so created_at can be nullable)
PRAGMA foreign_keys=OFF;
--> statement-breakpoint
CREATE TABLE `tasks_new` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	`title` text NOT NULL,
	`completed` integer DEFAULT 0 NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `tasks_new` (`id`, `user_id`, `title`, `completed`, `created_at`)
SELECT `id`, `user_id`, `title`, `completed`, `created_at` FROM `tasks`;
--> statement-breakpoint
DROP TABLE `tasks`;
--> statement-breakpoint
ALTER TABLE `tasks_new` RENAME TO `tasks`;
--> statement-breakpoint
CREATE INDEX `tasks_user_id_idx` ON `tasks` (`user_id`);
--> statement-breakpoint
-- Step 2: backfill with current timestamp (ms); preserve existing created_at
UPDATE `tasks`
SET `updated_at` = (cast(unixepoch('subsecond') * 1000 as integer));
--> statement-breakpoint
UPDATE `tasks`
SET `created_at` = (cast(unixepoch('subsecond') * 1000 as integer))
WHERE `created_at` IS NULL;
--> statement-breakpoint
ALTER TABLE `tasks` ADD `task_start_at` integer;
--> statement-breakpoint
ALTER TABLE `tasks` ADD `task_ends_at` integer;
--> statement-breakpoint
-- Step 3: enforce NOT NULL on created_at
CREATE TABLE `tasks_final` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	`title` text NOT NULL,
	`completed` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`task_start_at` integer,
	`task_ends_at` integer
);
--> statement-breakpoint
INSERT INTO `tasks_final` (`id`, `user_id`, `title`, `completed`, `created_at`, `updated_at`, `task_start_at`, `task_ends_at`)
SELECT `id`, `user_id`, `title`, `completed`, `created_at`, `updated_at`, `task_start_at`, `task_ends_at` FROM `tasks`;
--> statement-breakpoint
DROP TABLE `tasks`;
--> statement-breakpoint
ALTER TABLE `tasks_final` RENAME TO `tasks`;
--> statement-breakpoint
CREATE INDEX `tasks_user_id_idx` ON `tasks` (`user_id`);
--> statement-breakpoint
PRAGMA foreign_keys=ON;
