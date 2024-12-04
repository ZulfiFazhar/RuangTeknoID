import PropTypes from "prop-types";

export function ChatMessages({ messages }) {
  return (
    <div className="space-y-2">
      {messages.map((message, index) => (
        <div key={index} className="p-2 bg-gray-100 rounded-md">
          {message}
        </div>
      ))}
    </div>
  );
}

ChatMessages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.string).isRequired,
};
