"use server"
import { db } from "@/db";
import { products } from "@/db/schema";
import { authenticatedAction } from "@/services/server-only";
import { eq } from "drizzle-orm";

// Create the action with input validation
export const getProducts = authenticatedAction.create(async (context) => {

    const productsList = await db
      .select()
      .from(products)
      .where(eq(products.team_id, context.teamId!));

    return productsList;
  }
);
