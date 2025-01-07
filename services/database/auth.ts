"use server";

import { loginSchema, registerSchema } from "@/utils/schemas";
import { createClient } from "@/utils/supabase/supabase-client";
import { authenticatedAction, publicAction } from "../server-only";
import { db } from "@/db";
import { teams, users } from "@/db/schema";

const signIn = publicAction.create(
  loginSchema,
  async ({ email, password }, _) => {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }
  }
);

const signUp = publicAction.create(
  registerSchema,
  async ({ email, password, name, phoneNumber }, { success }) => {
    const supabase = await createClient();

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
      phone: phoneNumber,
    });
    if (error) {
      throw new Error(error.message);
    }

    await db.transaction(async (tx) => {
      const [newTeam] = await tx
        .insert(teams)
        .values({
          name: "Default Team",
          phone_number: phoneNumber,
        })
        .returning();

      await tx.insert(users).values({
        id: data.user?.id,
        email,
        name,
        team_id: newTeam.id,
        role: "admin",
      });
    });
  }
);

const signOut = publicAction.create(async ({}) => {
  const supabase = await createClient();
  await supabase.auth.signOut();
});

export { signIn, signUp, signOut };
