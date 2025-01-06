"use client";
import { Card } from "@/components/ui/card";
import { FileText, Package, Users } from "lucide-react";
import VoiceRecorder from "@/components/shared/voice-chat";

export default function Home() {

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        AI-Powered Stock Management
      </h1>
      <VoiceRecorder className="p-20"/>
    </main>
  );
}
