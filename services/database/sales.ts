"use server";

import { db } from "@/db";
import { products, stockTransactions } from "@/db/schema";
import { authenticatedAction } from "@/services/server-only";
import { and, AnyColumn, eq, ne, sql } from "drizzle-orm";
import { z } from "zod";

const decrement = (column: AnyColumn, value = 1) => {
  return sql`${column} - ${value}`;
};

export const getAvailableProducts = authenticatedAction.create(async (context) => {
  const productsList = await db
    .select()
    .from(products)
    .where(and(ne(products.quantity, 0), eq(products.team_id, context.teamId)));

  return productsList;
});

export const updateProductQuantity = authenticatedAction.create(
  z.object({
    productId: z.string(),
    quantity: z.number(),
    customerName: z.string().optional(),
    notes: z.string().optional(),
  }),
  async ({ productId, quantity, customerName, notes }, context) => {
    // Update product quantity
    await db
      .update(products)
      .set({
        quantity: decrement(products.quantity, quantity),
      })
      .where(and(eq(products.team_id, context.teamId), eq(products.id, productId)));

    // Insert a record into the stock_transactions table
    await db.insert(stockTransactions).values({
      product_id: productId,
      team_id: context.teamId,
      customer_name: customerName || null,
      quantity,
      notes: notes || null,
      created_at: new Date().toISOString(),
    });
  }
);
