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

interface VoiceRecorderProps {
  className?: string;
}

export default function VoiceRecorder({ className = "" }: VoiceRecorderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { isRecording, startRecording, cancelRecording , stopRecording } = useVoiceRecorder({
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
    }
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
                  <div key={i} className="loading-spinner-segment" style={{ 
                    transform: `rotate(${i * 45}deg)`,
                    animationDelay: `${i * 0.1}s`
                  }} />
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
                    animationDelay: `${i * 0.2}s`
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
          {!isRecording && !isPending && !isPlaying && "Click to start recording"}
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
    const response = await fetch("/api/voice", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to process voice");

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    // is playing
    return audio;
  } catch (error) {
    console.error("Error:", error);
    toast.error("Failed to process voice input");
  }
}

// Helper function to convert AudioBuffer to WAV
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2;
  const result = new ArrayBuffer(44 + length);
  const view = new DataView(result);
  const channels = [];
  let pos = 0;

  // Write WAV header
  writeString(view, pos, "RIFF");
  pos += 4;
  view.setUint32(pos, 36 + length, true);
  pos += 4;
  writeString(view, pos, "WAVE");
  pos += 4;
  writeString(view, pos, "fmt ");
  pos += 4;
  view.setUint32(pos, 16, true);
  pos += 4; // Format chunk length
  view.setUint16(pos, 1, true);
  pos += 2; // Format type
  view.setUint16(pos, numOfChan, true);
  pos += 2; // Number of channels
  view.setUint32(pos, buffer.sampleRate, true);
  pos += 4; // Sample rate
  view.setUint32(pos, buffer.sampleRate * 2 * numOfChan, true);
  pos += 4; // Byte rate
  view.setUint16(pos, numOfChan * 2, true);
  pos += 2; // Block align
  view.setUint16(pos, 16, true);
  pos += 2; // Bits per sample
  writeString(view, pos, "data");
  pos += 4;
  view.setUint32(pos, length, true);
  pos += 4;

  // Write PCM data
  for (let i = 0; i < buffer.numberOfChannels; i++)
    channels.push(buffer.getChannelData(i));

  while (pos < view.byteLength) {
    for (let i = 0; i < numOfChan; i++) {
      const sample = Math.max(-1, Math.min(1, channels[i][pos]));
      view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      pos += 2;
    }
  }

  return result;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
