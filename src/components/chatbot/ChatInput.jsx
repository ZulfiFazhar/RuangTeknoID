import { useRef } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SendHorizontal } from "lucide-react";

export default function ChatInput({
  inputValue,
  setInputValue,
  onSend,
  loading,
}) {
  const textareaRef = useRef(null);

  const handleInputChange = (e) => {
    const textarea = textareaRef.current;
    setInputValue(e.target.value);
    textarea.style.height = "2.5rem";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !loading) {
        onSend();
      }
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-gray-100 rounded-md">
      <Textarea
        ref={textareaRef}
        className="flex-1 focus-visible:ring-0 border-none shadow-none resize-none"
        placeholder="Ketik pesan Anda..."
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={onSend} disabled={loading || !inputValue.trim()}>
              <SendHorizontal />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Kirim pesan</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

ChatInput.propTypes = {
  inputValue: PropTypes.string.isRequired,
  setInputValue: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
