"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Mic, MicOff, Send } from "lucide-react";
import { toast } from "sonner";
import React from "react";
import VoiceRecorder from "@/components/shared/voice-chat";

export default function InvoicesPage() {
  // Text chat state
  const [message, setMessage] = useState("");

  // Text chat handlers
  const handleSendMessage = () => {
    toast.success("Message sent to AI agent");
    setMessage("");
  };


  return (
    <div className="space-y-6 w-1/2 mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Create Invoice</h1>
      </div>
      
      <Card className="p-6">
        <Tabs defaultValue="voice" className="w-full">
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
            <VoiceRecorder/>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}