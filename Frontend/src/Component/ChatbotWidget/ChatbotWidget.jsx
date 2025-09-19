
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import "./ChatbotWidget.css";

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi 👋 How can I help you today?" },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // --- MERMAID INTEGRATION ---

  // Effect to load the Mermaid.js script
  // useEffect(() => {
  //   if (isOpen) {
  //     const scriptId = 'mermaid-script';
  //     if (document.getElementById(scriptId)) return; // Script already exists

  //     const script = document.createElement('script');
  //     script.id = scriptId;
  //     script.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
  //     script.async = true;
  //     script.onload = () => {
  //       if (window.mermaid) {
  //         window.mermaid.initialize({ startOnLoad: false, theme: 'neutral' });
  //       }
  //     };
  //     document.body.appendChild(script);

  //     return () => {
  //       const existingScript = document.getElementById(scriptId);
  //       if (existingScript) {
  //         document.body.removeChild(existingScript);
  //       }
  //     };
  //   }
  // }, [isOpen]);

  // // Effect to render diagrams after messages are updated
  // useEffect(() => {
  //   if (messages.length > 0 && typeof window.mermaid !== 'undefined') {
  //     const timer = setTimeout(() => {
  //       try {
  //         // This command finds elements with class="mermaid" and renders them
  //         window.mermaid.run();
  //       } catch (e) {
  //         console.error("Mermaid rendering error:", e);
  //       }
  //     }, 100);
  //     return () => clearTimeout(timer);
  //   }
  // }, [messages]);

  // --- END MERMAID INTEGRATION ---

  useEffect(() => {
    sessionStorage.setItem("chat_history", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (input) => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: input,
          // history: messages,
        }),
      });

      if (!res.ok) throw new Error("Chatbot API failed");

      const data = await res.json();
      const botMessage = { role: "bot", text: data.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: " Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
       
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
              {loading && <div className="chat-msg bot-msg">⏳ Thinking...</div>}
              <div ref={messagesEndRef} />
            </div>

            <div className="chatbot-input">
              <ChatInput onSend={handleSendMessage} loading={loading} />
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
    </>
    
  );
}

export default ChatbotWidget;
