import ChatTextInput from "@/components/(private)/(home)/chat-text-input";
import { VoiceChat } from "@/components/shared";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-8">
        AI-Powered Stock Management
      </h1>
      <VoiceChat className="p-20" />
      <ChatTextInput />
    </main>
  );
}
