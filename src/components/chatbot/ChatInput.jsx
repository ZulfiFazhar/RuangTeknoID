import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ChatInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") {
      alert("Masukkan prompt terlebih dahulu.");
    }

    ChatInput.propTypes = {
      onSend: PropTypes.func.isRequired,
    };
  };
  onSend(input);
  setInput("");

  return (
    <div className="flex items-center gap-2">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Masukkan prompt Anda"
        className="flex-1"
      />
      <Button onClick={handleSend}>Send</Button>
    </div>
  );
}
