ALTER TABLE "products" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "embedding" vector(1536);--> statement-breakpoint
ALTER TABLE "providers" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "providers" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "providers" ADD COLUMN "embedding" vector(1536);