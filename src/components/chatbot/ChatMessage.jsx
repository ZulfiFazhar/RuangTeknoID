import { Sparkles } from "lucide-react";
import PropTypes from "prop-types";

export default function ChatMessage({ message }) {
  return (
    <div
      className={`flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`flex items-center ${
          message.sender === "user" ? "bg-gray-100" : ""
        } p-3 rounded-lg max-w-xs text-black`}
      >
        {message.sender === "bot" && <Sparkles className="mr-4" size={20} />}
        {message.text}
      </div>
    </div>
  );
}

ChatMessage.propTypes = {
  message: PropTypes.shape({
    sender: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
};
