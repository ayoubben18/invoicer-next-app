import { NextResponse } from "next/server";
import {
  extractUserInput,
  generateResponse,
} from "@/services/voice-chat/voice-service";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioBlob = formData.get("audio") as Blob;

    // Generate AI response
    const [audioFile, text] = await Promise.all([
      generateResponse(audioBlob),
      extractUserInput(audioBlob),
    ]);

    console.log(text);

    // send to SST BACK END

    return new NextResponse(audioFile, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("Error processing voice:", error);
    return NextResponse.json(
      { error: "Failed to process voice input" },
      { status: 500 }
    );
  }
}
