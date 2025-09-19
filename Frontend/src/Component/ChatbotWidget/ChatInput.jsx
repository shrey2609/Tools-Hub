import { useState } from "react";

function ChatInput({ onSend, loading }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-box">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Ask anything..."
        disabled={loading}
      />
      <button onClick={handleSend} disabled={loading || !input.trim()}>
        ➤
      </button>
    </div>
  );
}

export default ChatInput;
