// src/pages/Chatbot.jsx
import { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/chatbot/ChatMessage";
import ChatLoading from "@/components/chatbot/ChatLoading";
import ChatInput from "@/components/chatbot/ChatInput";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isScrolledUp, setIsScrolledUp] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputContainerRef = useRef(null); // Referensi untuk input

  const apiKey = import.meta.env.VITE_REACT_APP_API_KEY;
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  // Scroll otomatis ke bawah
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll otomatis setiap ada pesan baru
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Deteksi scroll untuk menampilkan tombol "Scroll Down"
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const isAtBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 50;

    setIsScrolledUp(!isAtBottom);
  };

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
      <div className="w-full max-w-3xl h-fit flex flex-col overflow-hidden relative">
        {/* Kontainer pesan */}
        <div
          className="flex-1 overflow-auto p-4 bg-white"
          ref={messagesContainerRef}
          onScroll={handleScroll}
        >
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {loading && <ChatLoading />}
          <div ref={messagesEndRef} />
        </div>

        {/* Tombol Scroll Down */}
        {isScrolledUp && (
          <Button
            variant="outline"
            size="icon"
            onClick={scrollToBottom}
            className="absolute left-1/2 -translate-x-1/2 z-10 rounded-full"
            style={{
              bottom: `${
                inputContainerRef.current
                  ? inputContainerRef.current.offsetHeight + 10
                  : 60
              }px`, // Dinamis berdasarkan tinggi input
            }}
          >
            <ArrowDown />
          </Button>
        )}

        {/* Input area */}
        <div ref={inputContainerRef} className="w-full">
          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSend={fetchResponse}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
