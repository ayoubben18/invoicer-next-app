"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Send } from "lucide-react";
import { toast } from "sonner";

export default function VoiceChat() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const recorder = new MediaRecorder(stream, {
            mimeType: "audio/webm;codecs=opus",
          });

          recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };

          setMediaRecorder(recorder);
        })
        .catch((err) => {
          console.error("Error accessing microphone:", err);
          toast.error("Error accessing microphone");
        });
    }
  }, []);

  const startRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "inactive") {
      audioChunksRef.current = [];
      mediaRecorder.start(250); // Collect data every 250ms
      setIsRecording(true);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);

      // Wait for the last chunks to be processed
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (audioChunksRef.current.length === 0) {
        toast.error("No audio recorded");
        return;
      }

      // Create audio blob and send to server
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm;codecs=opus",
      });
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
    }
  };

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
