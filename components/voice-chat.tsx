"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Send } from "lucide-react";
import { toast } from "sonner";

export default function VoiceChat() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const recorder = new MediaRecorder(stream);
          recorder.ondataavailable = (e) => {
            setAudioChunks((chunks) => [...chunks, e.data]);
          };
          setMediaRecorder(recorder);
        })
        .catch((err) => {
          console.error("Error accessing microphone:", err);
          toast.error("Could not access microphone");
        });
    }
  }, []);

  const startRecording = () => {
    setAudioChunks([]);
    mediaRecorder?.start();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    mediaRecorder?.stop();
    setIsRecording(false);

    // Create audio blob and send to server
    console.log(audioChunks);

    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("audio", audioBlob);

    try {
      console.log(formData);
      const response = await fetch("/api/voice", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      console.log(data);

      toast.success("Voice message processed successfully");
    } catch (error) {
      toast.error("Failed to process voice message");
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
