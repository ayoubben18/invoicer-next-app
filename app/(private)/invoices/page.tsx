"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Mic, MicOff, Send } from "lucide-react";
import { toast } from "sonner";
import React, { useEffect, useRef } from "react";

export default function InvoicesPage() {
  // Text chat state
  const [message, setMessage] = useState("");
  
  // Voice chat state
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Voice recording setup
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

  // Text chat handlers
  const handleSendMessage = () => {
    toast.success("Message sent to AI agent");
    setMessage("");
  };

  // Voice chat handlers
  const startRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "inactive") {
      audioChunksRef.current = [];
      mediaRecorder.start(250); // Collect data every 250ms
      setIsRecording(true);
      console.log("Recording");
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
    <div className="space-y-6 w-1/2 mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Create Invoice</h1>
      </div>
      
      <Card className="p-6">
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Voice Chat
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Text Chat
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Message to AI Agent</label>
              <Textarea
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[200px] resize-none"
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleSendMessage}
                className="flex items-center gap-2"
                disabled={!message}
              >
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="voice" className="space-y-4">
            <div className="flex flex-col items-center justify-center min-h-[200px] bg-muted/5 rounded-lg border-2 border-dashed">
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
              <p className="text-sm text-muted-foreground mt-4">
                {isRecording
                  ? "Recording... Click to stop"
                  : "Click to start recording"}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}