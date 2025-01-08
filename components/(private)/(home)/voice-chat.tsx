// components/VoiceRecorder.tsx
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, SendHorizontal, X } from "lucide-react";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { generateVoice } from "@/services/llm-calls/voice";
import { audioBufferToWav } from "@/utils/lib";

interface VoiceChatProps {
  className?: string;
}

export default function VoiceChat({ className = "" }: VoiceChatProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { isRecording, startRecording, cancelRecording, stopRecording } =
    useVoiceRecorder({
      onStop: async (audioBlob: Blob) => {
        const audio = await mutateAsync({ audioBlob });
        if (audio) {
          setIsPlaying(true);
          await audio.play();
          audio.onended = () => {
            setIsPlaying(false);
          };
        }
      },
      onCancel: () => {
        toast("Recording cancelled");
      },
    });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: onAudioRecording,
  });

  return (
    <Card className={cn("p-6 max-w-2xl mx-auto mt-8", className)}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* Recording animation rings */}
          {isRecording && (
            <>
              <div className="absolute inset-0 rounded-full animate-ping-slow bg-red-500/20" />
              <div className="absolute inset-0 rounded-full animate-ping-slower bg-red-500/10" />
            </>
          )}

          {/* Loading animation */}
          {isPending && (
            <div className="absolute -inset-4">
              <div className="loading-spinner">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="loading-spinner-segment"
                    style={{
                      transform: `rotate(${i * 45}deg)`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <Button
            variant={isRecording ? "destructive" : "default"}
            size="lg"
            onClick={!isRecording ? startRecording : undefined}
            className={cn(
              "w-16 h-16 rounded-full transition-transform duration-200",
              isRecording && "scale-110",
              isPending && "opacity-80"
            )}
            disabled={isPending || isPlaying}
          >
            <Mic className="w-6 h-6" />
          </Button>
        </div>

        {/* Confirm/Cancel buttons during recording */}
        {isRecording && (
          <div className="flex gap-4 mt-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10"
              onClick={() => cancelRecording()}
            >
              <X className="w-5 h-5" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="rounded-full w-10 h-10"
              onClick={() => stopRecording()}
            >
              <SendHorizontal className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Playing animation below the mic */}
        {isPlaying && (
          <div className="h-8 flex items-center justify-center mt-2">
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full"
                  style={{
                    height: "16px",
                    animation: "sound-wave 1s ease-in-out infinite",
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <p className="text-sm text-muted-foreground text-center">
          {isRecording && "Recording..."}
          {isPending && "Processing your voice..."}
          {isPlaying && "Playing response..."}
          {!isRecording &&
            !isPending &&
            !isPlaying &&
            "Click to start recording"}
        </p>
      </div>
    </Card>
  );
}

type AudioRecording = {
  audioBlob: Blob;
};

async function onAudioRecording({ audioBlob }: AudioRecording) {
  // Convert WebM to WAV using Web Audio API
  const audioContext = new AudioContext();
  const audioData = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(audioData);

  // Create WAV file
  const wavBuffer = await audioBufferToWav(audioBuffer);
  const wavBlob = new Blob([wavBuffer], { type: "audio/wav" });

  const formData = new FormData();
  formData.append("audio", wavBlob);

  try {
    const newFormData = await generateVoice({ formData });
    const audioBlob = newFormData.get("audio") as Blob;
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    // is playing
    return audio;
  } catch (error) {
    console.error("Error:", error);
    toast.error("Failed to process voice input");
  }
}
