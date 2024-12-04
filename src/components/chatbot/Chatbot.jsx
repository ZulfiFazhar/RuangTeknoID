import { useState } from "react";
import { generateChatResponse } from "@/api/api.chatbot";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";

export function ChatBot() {
  const [messages, setMessages] = useState([]);

  const handleSend = async (message) => {
    setMessages((prev) => [...prev, `You: ${message}`]);

    try {
      const response = await generateChatResponse(message);
      setMessages((prev) => [...prev, `Bot: ${response}`]);
    } catch {
      setMessages((prev) => [
        ...prev,
        "Bot: Terjadi kesalahan. Silakan coba lagi.",
      ]);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-md">
      <ChatMessages messages={messages} />
      <ChatInput onSend={handleSend} />
    </div>
  );
}
