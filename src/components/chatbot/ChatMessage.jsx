import { Sparkles } from "lucide-react";
import PropTypes from "prop-types";
import Markdown from "react-markdown";

export default function ChatMessage({ message }) {
  return (
    <div
      className={`flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`flex ${
          message.sender === "user" ? "bg-gray-100" : ""
        } items-start p-3 rounded-lg text-black ${
          message.sender === "user" ? "max-w-[80%]" : "max-w-[95%]"
        }`}
      >
        {message.sender === "bot" && (
          <div className="mr-4 flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
        )}
        <div className="prose text-sm leading-relaxed">
          <Markdown>{message.text}</Markdown>
        </div>
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
