CREATE TABLE `favorites` (
	`id` integer PRIMARY KEY NOT NULL,
	`favorited_by_user` text,
	`user_name` text,
	`user_image` text,
	`meal_name` text,
	`selected_value` text,
	`image` text,
	`ingredients` text,
	`the_way` text,
	`advise` text,
	`link` text,
	`number_of_likes` integer DEFAULT 0,
	`number_of_hearts` integer DEFAULT 0,
	`number_of_emojis` integer DEFAULT 0,
	`heart` integer DEFAULT 0 NOT NULL,
	`like` integer DEFAULT 0 NOT NULL,
	`emoji` integer DEFAULT 0 NOT NULL,
	`post_id` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `meals` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_name` text NOT NULL,
	`created_by` text NOT NULL,
	`user_image` text NOT NULL,
	`meal_name` text NOT NULL,
	`selected_value` text NOT NULL,
	`image` text NOT NULL,
	`ingredients` text NOT NULL,
	`the_way` text NOT NULL,
	`advise` text,
	`link` text,
	`favorite` integer DEFAULT 0 NOT NULL,
	`users_who_likes_this_recipe` text DEFAULT '[]' NOT NULL,
	`users_who_put_emoji_on_this_recipe` text DEFAULT '[]' NOT NULL,
	`users_who_put_heart_on_this_recipe` text DEFAULT '[]' NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text,
	`is_admin` integer DEFAULT 0 NOT NULL,
	`image` text DEFAULT 'https://res.cloudinary.com/dh2xlutfu/image/upload/v1720033330/qvvkquzk4djn2bl9jcwb.jpg',
	`google_id` text DEFAULT (ABS(RANDOM() % 1000000000)),
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_google_id_unique` ON `users` (`google_id`);