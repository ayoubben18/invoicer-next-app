"use server"
import { db } from "@/db";
import { teams } from "@/db/schema";
import { authenticatedAction } from "@/services/server-only";
import { eq } from "drizzle-orm";

// Create the action with input validation
export const getTeam = authenticatedAction.create(async (context) => {

    const team = await db
      .select()
      .from(teams)
      .where(eq(teams.id, context.teamId));

    return team;
  }
);
