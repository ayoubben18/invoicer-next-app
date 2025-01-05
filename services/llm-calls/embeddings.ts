"use server";

import { z } from "zod";
import { publicAction } from "../server-only";
import { embeddingModel } from "./clients";

const generateEmbeddings = publicAction.create(
  z.object({
    text: z.string(),
  }),
  async ({ text }) => {
    const embeddings = await embeddingModel.embedQuery(text);

    return {
      embeddings,
    };
  }
);

export { generateEmbeddings };
