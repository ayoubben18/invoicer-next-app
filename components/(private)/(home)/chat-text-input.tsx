"use client";

import { useState } from "react";
import { SendHorizontal } from "lucide-react";

const ChatTextInput = () => {
  const [message, setMessage] = useState("");
  const handleSendText = () => {
    console.log(message);
  };
  return (
    <div className="fixed bottom-4 left-0 right-0 mx-auto max-w-xl px-4">
      <div
        className="flex items-center 
                    bg-gray-100/80 dark:bg-white/10 
                    backdrop-blur-lg border 
                    border-gray-300 dark:border-white/20 
                    rounded-full shadow-md p-2"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 bg-transparent text-gray-800 dark:text-gray-100 
                   placeholder-gray-800 dark:placeholder-gray-300 
                   rounded-full outline-none"
        />
        <button
          onClick={handleSendText}
          className="ml-2 bg-gray-800 dark:bg-white text-white dark:text-black 
                   rounded-full p-2 hover:bg-gray-900 dark:hover:bg-slate-200 
                   transition disabled:bg-gray-400"
          disabled={message.trim() == ""}
        >
          <SendHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatTextInput;
