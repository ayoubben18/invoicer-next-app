// components/VoiceRecorder.tsx
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff } from "lucide-react";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";

interface VoiceRecorderProps {
  onAudioRecorded: (audioBlob: Blob) => Promise<void>;
  className?: string;
}

export default function VoiceRecorder({
  onAudioRecorded,
  className = "",
}: VoiceRecorderProps) {
  const { isRecording, startRecording, stopRecording } = useVoiceRecorder({
    onStop: async (audioBlob: Blob) => {
      await onAudioRecorded(audioBlob);
    },
  });

  return (
    <Card className={`p-6 max-w-2xl mx-auto mt-8 ${className}`}>
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
