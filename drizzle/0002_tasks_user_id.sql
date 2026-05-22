-- Legacy tasks were not scoped to a user; remove them before enforcing ownership.
DELETE FROM `tasks`;
--> statement-breakpoint
ALTER TABLE `tasks` ADD `user_id` text NOT NULL REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade;
--> statement-breakpoint
CREATE INDEX `tasks_user_id_idx` ON `tasks` (`user_id`);
