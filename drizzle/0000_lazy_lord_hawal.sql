CREATE TABLE `payment` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`email` text,
	`type` text NOT NULL,
	`amount` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pdf_data` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`text` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
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
	`report` text,
	`started_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`finished_at` text,
	FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `quiz_shares` (
	`id` integer PRIMARY KEY NOT NULL,
	`quiz_id` integer NOT NULL,
	`share_token` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `quizzes` (
	`id` integer PRIMARY KEY NOT NULL,
	`topic` text NOT NULL,
	`questions` text NOT NULL,
	`orginal_quiz_id` integer,
	`timeline` text,
	`context` text,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`text` text NOT NULL,
	`quiz_id` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `youtube_video` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`video_id` text NOT NULL,
	`title` text NOT NULL,
	`transcript` text NOT NULL,
	`summarized_transcript` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
