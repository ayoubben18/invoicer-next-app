"use server"
import { db } from "@/db";
import { providers } from "@/db/schema";
import { authenticatedAction } from "@/services/server-only";
import { eq } from "drizzle-orm";

// Create the action with input validation
export const getProviders = authenticatedAction.create(async (context) => {

    const productsList = await db
      .select()
      .from(providers)
      .where(eq(providers.team_id, context.teamId!));

    return productsList;
  }
);
