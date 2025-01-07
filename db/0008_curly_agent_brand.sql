ALTER TABLE "stock_transactions" DROP CONSTRAINT "stock_transactions_user_id_users_id_fk";
--> statement-breakpoint
DROP INDEX "transactions_user_idx";--> statement-breakpoint
ALTER TABLE "stock_transactions" ADD COLUMN "team_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_transactions" ADD COLUMN "customer_name" text;--> statement-breakpoint
ALTER TABLE "stock_transactions" ADD CONSTRAINT "stock_transactions_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "transactions_team_idx" ON "stock_transactions" USING btree ("team_id");--> statement-breakpoint
ALTER TABLE "stock_transactions" DROP COLUMN "user_id";