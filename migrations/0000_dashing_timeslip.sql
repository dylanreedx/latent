CREATE TABLE `quizes` (
	`id` integer PRIMARY KEY NOT NULL,
	`topic` text NOT NULL,
	`questions` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
