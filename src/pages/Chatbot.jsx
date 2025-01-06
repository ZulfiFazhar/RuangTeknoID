// src/pages/Chatbot.jsx
import { useState, useRef, useEffect, useContext } from "react";
import ChatMessage from "@/components/chatbot/ChatMessage";
import ChatLoading from "@/components/chatbot/ChatLoading";
import ChatInput from "@/components/chatbot/ChatInput";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { AuthContext } from "@/App";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const { authStatus } = useContext(AuthContext);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputContainerRef = useRef(null); // Referensi untuk input

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

    try {
      const response = await api.post("/gemini/generate-text", {
        prompt: inputValue,
      });

      const generatedText =
        response.data?.data?.response || "Tidak ada respons.";
      setMessages((prev) => [...prev, { text: generatedText, sender: "bot" }]);
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

  if (!authStatus.authStatus) {
    return (
        <div>
            <h1>Anda harus login terlebih dahulsu untuk menggunakan fitur asisten AI.</h1>
        </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-[88vh]">
      {messages.length === 0 && (
        <h1 className="text-3xl font-semibold text-center mb-10 cursor-default">
          Hello, {authStatus.user.name.split(" ")[0]}!
        </h1>
      )}
      <div className="w-full max-w-3xl h-fit flex flex-col overflow-hidden relative">
        <div
          className="flex-1 overflow-auto p-4"
          ref={messagesContainerRef}
          onScroll={handleScroll}
        >
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {loading && <ChatLoading />}
          <div ref={messagesEndRef} />
        </div>

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
              }px`,
            }}
          >
            <ArrowDown />
          </Button>
        )}

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
