ALTER TABLE "products" ALTER COLUMN "price" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "restock_threshold" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "providers" ALTER COLUMN "phone_number" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "providers" ALTER COLUMN "identity_card" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "providers" ALTER COLUMN "email" DROP NOT NULL;