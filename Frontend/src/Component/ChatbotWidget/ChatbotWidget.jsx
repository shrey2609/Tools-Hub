import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import "./ChatbotWidget.css";

//API URL from environment variables.
const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL;   // port value present in the env file of Frontend

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi 👋 How can I help you today?" },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // persist chat history to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem("chat_history", JSON.stringify(messages));
    } catch (e) {
      console.error("Failed to persist chat history:", e);
    }
  }, [messages]);

  // scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // handle sending message with streaming response
  const handleSendMessage = async (input) => {
    if (!input.trim()) return;

    if (!CHAT_API_URL) {
      console.error("VITE_CHAT_API_URL is not defined");
      return;
    }

    // Add user message
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Add assistant placeholder
    setMessages((prev) => [...prev, { role: "bot", text: "" }]);

    setLoading(true);

    try {
      const response = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: input }),
      });

      if (response.status === 401) {
        throw new Error("Unauthorized: The backend is requiring a key.");
      }

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(
          `HTTP error ${response.status} ${response.statusText} ${errText}`
        );
      }

      // streaming read
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // messages separated by double-newline
        const lines = buffer.split("\n\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith("data:")) {
            const jsonStr = line.substring(5).trim();
            try {
              const data = JSON.parse(jsonStr);

              if (data.token) {
                setMessages((prev) =>
                  prev.map((m, i) =>
                    i === prev.length - 1
                      ? { ...m, text: m.text + data.token }
                      : m
                  )
                );
              } else if (data.message || data.answer || data.text) {
                const chunk =
                  data.message ?? data.answer ?? data.text;
                setMessages((prev) =>
                  prev.map((m, i) =>
                    i === prev.length - 1
                      ? { ...m, text: m.text + chunk }
                      : m
                  )
                );
              }
            } catch (err) {
              console.error("Failed to parse stream JSON:", err, line);
            }
          }
        }
      }
    } catch (err) {
      console.error("Stream error:", err);
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1
            ? { ...m, text: `**Error:** ${err.message}` }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // clear chat
  const clearChat = () => {
    setMessages([{ role: "bot", text: "Hi 👋 How can I help you today?" }]);
    try {
      sessionStorage.removeItem("chat_history");
    } catch {}
  };

  return (
    <div className="chatbot-widget">
      {isOpen && (
        <div className={`chatbot-window ${isFullscreen ? "fullscreen" : ""}`}>
          <div className="chatbot-header">
            <span>ChatBot</span>
            <div className="header-buttons">
              <button onClick={() => setIsFullscreen((f) => !f)}>
                {isFullscreen ? "🗗" : "🗖"}
              </button>
              <button onClick={() => setIsOpen(false)}>✖</button>
            </div>
          </div>

          <div className="chatbot-messages">
            <ChatMessages messages={messages} />
            {loading && (
              <div className="chat-msg bot-msg">⏳ Thinking...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <ChatInput onSend={handleSendMessage} loading={loading} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 6,
              }}
            >
              <button onClick={clearChat} style={{ fontSize: 12 }}>
                Clear
              </button>
              <small style={{ fontSize: 11, color: "#666" }}>
                Server: {CHAT_API_URL}
              </small>
            </div>
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          className="chatbot-toggle"
          onClick={() => setIsOpen(true)}
        >
          💬
        </button>
      )}
    </div>
  );
}

export default ChatbotWidget;
