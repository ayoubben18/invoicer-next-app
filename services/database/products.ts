"use server";

import { z } from "zod";
import { authenticatedAction } from "../server-only";
import { eq, and, ilike, gte, lte } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";

const getProducts = authenticatedAction.create(
  z.object({
    searchTerm: z.string().optional(),
    filter: z.enum(["all", "low", "high"]).default("all"),
  }),
  async ({ searchTerm, filter }, { userId, teamId }) => {
    let whereClause = and(
      eq(products.team_id, teamId),
      searchTerm ? ilike(products.name, `%${searchTerm}%`) : undefined,
      filter && filter !== "all"
        ? filter === "low"
          ? lte(products.quantity, 50)
          : gte(products.quantity, 50)
        : undefined
    );
    const data = await db.select().from(products).where(whereClause);

    return data;
  }
);

export { getProducts };
