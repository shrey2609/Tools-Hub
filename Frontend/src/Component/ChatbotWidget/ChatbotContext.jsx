import React, { createContext, useEffect, useState } from "react";

export const ChatbotUIContext = createContext();

export function ChatbotProvider({ children }) {
  const STORAGE_KEY = "chat_messages_v1";

  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Load session messages on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        setChatMessages(JSON.parse(saved));
      } else {
        setChatMessages([
          { role: "assistant", content: "Hi 👋 How can I help you today?", time: new Date().toISOString() }
        ]);
      }
    } catch (e) {
      console.error("Failed to load session messages:", e);
    }
  }, []);

  // Persist messages to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(chatMessages));
    } catch (e) {
      console.error("Failed to save session messages:", e);
    }
  }, [chatMessages]);

  // sendMessage: safe, with timeout and error handling
  const sendMessage = async (message) => {
    if (!message || !message.trim()) return;
    const userMsg = { role: "user", content: message.trim(), time: new Date().toISOString() };
    setChatMessages((prev) => [...prev, userMsg]);
    setUserInput("");
    setIsGenerating(true);

    try {
      // Abort after 30s
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      // NOTE: This uses a relative path /query. See package.json proxy note below if you use localhost backend.
      const res = await fetch("/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: message.trim() }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Server returned ${res.status} ${res.statusText} ${text}`);
      }

      // Accept flexible response shapes: { answer } or { reply } or raw
      const data = await res.json().catch(() => null);
      const botText = (data && (data.answer || data.reply || data.text)) ?? (typeof data === "string" ? data : JSON.stringify(data, null, 2));

      const botMsg = { role: "assistant", content: botText, time: new Date().toISOString() };
      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("sendMessage error:", err);
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: " Error: could not reach chatbot backend. Try again later.", time: new Date().toISOString() }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ChatbotUIContext.Provider
      value={{
        chatMessages,
        setChatMessages,
        userInput,
        setUserInput,
        isGenerating,
        sendMessage
      }}
    >
      {children}
    </ChatbotUIContext.Provider>
  );
}
