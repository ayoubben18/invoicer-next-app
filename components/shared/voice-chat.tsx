"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff } from "lucide-react";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import { toast } from "sonner";

export default function VoiceChat() {
  const { isRecording, startRecording, stopRecording } = useVoiceRecorder({
    onStop: async (audioBlob) => {
      // Handle the audio blob here
      const formData = new FormData();
      formData.append("audio", audioBlob);
      formData.append("type", "stock_management");

      try {
        const response = await fetch("/api/voice", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        console.log(data);
        toast.success(data.response || "Voice message processed successfully");
      } catch (error) {
        console.error("Error processing voice:", error);
        toast.error("Failed to process voice message");
      }
    },
  });

  return (
    <Card className="p-6 max-w-2xl mx-auto mt-8">
      <div className="flex flex-col items-center gap-4">
        <Button
          variant={isRecording ? "destructive" : "default"}
          size="lg"
          onClick={isRecording ? stopRecording : startRecording}
          className="w-16 h-16 rounded-full"
        >
          {isRecording ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </Button>
        <p className="text-sm text-muted-foreground">
          {isRecording
            ? "Recording... Click to stop"
            : "Click to start recording"}
        </p>
      </div>
    </Card>
  );
}
