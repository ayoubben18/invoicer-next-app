"use server";

import { z } from "zod";
import { authenticatedAction, redisClient } from "../server-only";
import {
  extractUserInput,
  generateResponse,
} from "../voice-chat/voice-service";
import { db } from "@/db";
import { processes } from "@/db/schema";
import { nanoid } from "nanoid";

const generateVoice = authenticatedAction.create(
  z.object({
    formData: z.instanceof(FormData),
  }),
  async ({ formData }, { teamId }) => {
    const audioBlob = formData.get("audio") as Blob;

    const [audioFile, _] = await Promise.all([
      generateResponse(audioBlob),
      extractUserInput(audioBlob).then(async (text) => {
        await db.transaction(async (tx) => {
          const [insertedProcess] = await tx
            .insert(processes)
            .values({
              team_id: teamId,
              text: text,
              status: "pending",
            })
            .returning({ id: processes.id });

          const token = nanoid();

          await redisClient.set(`process-${insertedProcess.id}`, token, {
            ex: 60,
          });

          await fetch(`${process.env.AWS_SST_ENDPOINT}/add-products-process`, {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              processId: insertedProcess.id,
              teamId,
              prompt: text,
            }),
          });
        });
      }),
    ]);

    const newFormData = new FormData();
    const returnBlob = new Blob([audioFile], { type: "audio/mpeg" });
    newFormData.append("audio", returnBlob);

    return newFormData;
  }
);

export { generateVoice };
