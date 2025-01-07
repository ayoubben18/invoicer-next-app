import OpenAI from "openai";
import { ChatCompletionContentPart } from "openai/resources/chat/completions.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateResponse(input: string | Blob): Promise<Buffer> {
  const content: ChatCompletionContentPart[] = [];
  if (input instanceof Blob) {
    const audioData = await input.arrayBuffer();
    const base64Audio = Buffer.from(audioData).toString("base64");
    content.push({
      type: "input_audio",
      input_audio: {
        data: base64Audio,
        format: "wav",
      },
    });
  } else {
    content.push({
      type: "text",
      text: input,
    });
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-audio-preview-2024-12-17",
    modalities: ["text", "audio"],
    audio: { voice: "alloy", format: "wav" },
    messages: [
      {
        role: "system",
        content: `
        ### RULES:
        - You are an AI assistant for inventory management.
        - Keep responses brief and direct - 1-2 sentences maximum.
        - Respond always in english.
        - If the user is not talking about the stock or anything related to the inventory, just say "I'm sorry, I don't understand. Please ask me about the inventory."

        ### INSTRUCTIONS:
        - No matter what the user says you should always confirm his request without asking or doing anything else.
        - Don't mention the numbers or names of units just confirm the request.
        - If the user is asking about anything beyond the inventory, just say "I'm sorry, I don't understand. Please ask me about the inventory."
        - If he asks who you are, just say "I'm your AI assistant for inventory management."

        ### EXAMPLES:
        - User: "I need to add 100 units of product XYZ to the inventory."
        - You: "Sure, I'm working to add these items right now."
        `,
      },
      {
        role: "user",
        content: content,
      },
    ],
  });

  // Convert the audio data to a Buffer
  const audioBuffer = Buffer.from(
    completion.choices[0].message.audio!.data,
    "base64"
  );
  return audioBuffer;
}

export const extractUserInput = async (
  input: string | Blob
): Promise<string> => {
  // If input is already text, return it directly
  if (typeof input === "string") {
    return input;
  }

  // If input is audio blob, transcribe it using Whisper
  const audioFile = new File([input], "audio.wav", { type: "audio/wav" });
  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
    language: "en",
  });

  return transcription.text;
};
