import OpenAI from "openai";
import twilio from "twilio";
import {} from "@langchain/openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// const twilioClient = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioBlob = formData.get("audio");

    if (!audioBlob || !(audioBlob instanceof Blob)) {
      return Response.json(
        { error: "No audio file received" },
        { status: 400 }
      );
    }

    // Convert blob to File object
    const audioFile = new File([audioBlob], "audio.webm", {
      type: "audio/webm",
    });

    console.log(audioFile);

    // Transcribe audio to text
    const transcript = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });

    // structured output
    // get the transcripted audio and send it to the user

    // Process the transcribed text with GPT-4
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a stock management assistant.",
        },
        {
          role: "user",
          content: transcript.text,
        },
      ],
    });

    return Response.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error processing audio:", error);
    return Response.json({ error: "Failed to process audio" }, { status: 500 });
  }
}
