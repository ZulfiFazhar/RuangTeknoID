import { useState } from "react";
import ChatMessage from "@/components/chatbot/ChatMessage";
import ChatLoading from "@/components/chatbot/ChatLoading";
import ChatInput from "@/components/chatbot/ChatInput";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_REACT_APP_API_KEY;
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  const fetchResponse = async () => {
    if (inputValue.trim() === "") {
      alert("Masukkan pesan terlebih dahulu.");
      return;
    }

    setMessages((prev) => [...prev, { text: inputValue, sender: "user" }]);
    setInputValue("");
    setLoading(true);

    const body = {
      contents: [
        {
          parts: [
            {
              text: inputValue,
            },
          ],
        },
      ],
    };

    try {
      const response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        const generatedText =
          data.candidates[0]?.content?.parts[0]?.text || "Tidak ada respons.";
        setMessages((prev) => [
          ...prev,
          { text: generatedText, sender: "bot" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { text: "Gagal mendapatkan respons dari API.", sender: "bot" },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Terjadi kesalahan. Silakan coba lagi.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[88vh]">
      <div className="w-full max-w-3xl h-fit flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-4 bg-white">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {loading && <ChatLoading />}
        </div>
        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSend={fetchResponse}
          loading={loading}
        />
      </div>
    </div>
  );
}
