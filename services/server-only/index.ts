import "server-only";
import { createSafeAction } from "next-safe-fetch";
import { createClient } from "@/utils/supabase/supabase-client";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { teams, users } from "@/db/schema";

export const authenticatedAction = createSafeAction.setMiddleware(async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  // console.log("user", user);

  if (!user) {
    throw new Error("Unauthorized");
  }

  const [team] = await db
    .select({ fullName: users.name, teamID: teams.id })
    .from(users)
    .leftJoin(teams, eq(teams.id, users.team_id))
    .where(eq(users.id, user.id));

  if (!team) {
    throw new Error("Team not found");
  }

  return {
    userId: user.id,
    email: user.email!,
    teamId: team.teamID!,
    fullName: team.fullName
  };
});

export const publicAction = createSafeAction.setMiddleware(async () => {
  return {
    success: true,
  };
});
