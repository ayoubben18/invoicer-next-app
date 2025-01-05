"use server";

import { z } from "zod";
import { authenticatedAction } from "../server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";

const getProducts = authenticatedAction.create(
  z.object({
    searchTerm: z.string().optional(),
  }),
  async ({ searchTerm }, { userId, teamId }) => {
    const data = await db
      .select()
      .from(products)
      .where(eq(products.team_id, teamId));
  }
);

export { getProducts };
