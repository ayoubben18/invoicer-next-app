"use server";
import { db } from "@/db";
import { providers } from "@/db/schema";
import { authenticatedAction } from "@/services/server-only";
import { and, eq, ilike } from "drizzle-orm";
import { z } from "zod";
// Create the action with input validation
const getProviders = authenticatedAction.create(
  z.object({
    searchTerm: z.string().optional(),
    category: z.string().default("all"),
  }),
  async ({ searchTerm, category }, { teamId }) => {
    let whereClause = and(
      eq(providers.team_id, teamId),
      searchTerm ? ilike(providers.name, `%${searchTerm}%`) : undefined,
      category && category !== "all"
        ? eq(providers.category, category)
        : undefined
    );

    const productsList = await db.select().from(providers).where(whereClause);

    return productsList;
  }
);

const getCategories = authenticatedAction.create(async (context) => {
  const categories = await db
    .selectDistinct({ category: providers.category })
    .from(providers)
    .where(eq(providers.team_id, context.teamId));

  return categories.reduce((acc, category) => {
    if (category.category && !acc.includes(category.category)) {
      acc.push(category.category);
    }
    return acc;
  }, [] as string[]);
});

export { getCategories, getProviders };
