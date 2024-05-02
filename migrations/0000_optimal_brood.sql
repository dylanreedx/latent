CREATE TABLE `quiz_attempt_questions` (
	`id` integer PRIMARY KEY NOT NULL,
	`quiz_attempt_id` integer NOT NULL,
	`question` text NOT NULL,
	`user_answer` text,
	`correct_answer` text,
	`is_correct` integer,
	FOREIGN KEY (`quiz_attempt_id`) REFERENCES `quiz_attempts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `quiz_attempts` (
	`id` integer PRIMARY KEY NOT NULL,
	`quiz_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`score` integer,
	`max_score` integer,
	`grade` text,
	`started_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`finished_at` text,
	FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `quiz_shares` (
	`id` integer PRIMARY KEY NOT NULL,
	`quiz_id` integer NOT NULL,
	`share_token` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `quizzes` (
	`id` integer PRIMARY KEY NOT NULL,
	`topic` text NOT NULL,
	`questions` text NOT NULL,
	`orginal_quiz_id` integer,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
