CREATE TYPE "public"."process_status" AS ENUM('pending', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "processes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" "process_status" DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "processes" ADD CONSTRAINT "processes_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "processes_team_idx" ON "processes" USING btree ("team_id");