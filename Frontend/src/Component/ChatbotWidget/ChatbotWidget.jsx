// // ChatbotWidget.jsx
// import React, { useState, useEffect, useRef } from "react";
// import ChatInput from "./ChatInput";
// import ChatMessages from "./ChatMessages";
// import "./ChatbotWidget.css";

// function ChatbotWidget() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [messages, setMessages] = useState([
//     { role: "bot", text: "Hi 👋 How can I help you today?" },
//   ]);
//   const [loading, setLoading] = useState(false);
//   const [apiKey, setApiKey] = useState(
//     () => localStorage.getItem("apiKey") || ""
//   );
//   const messagesEndRef = useRef(null);

//   // persist chat history to sessionStorage
//   useEffect(() => {
//     try {
//       sessionStorage.setItem("chat_history", JSON.stringify(messages));
//     } catch (e) {
//       console.error("Failed to persist chat history:", e);
//     }
//   }, [messages]);

//   // scroll to bottom when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // persist apiKey to localStorage
//   useEffect(() => {
//     if (apiKey) localStorage.setItem("apiKey", apiKey);
//     else localStorage.removeItem("apiKey");
//   }, [apiKey]);

//   // handle sending message with streaming (SSE-like) response handling
//   const handleSendMessage = async (input) => {
//     if (!input.trim()) return;

//     // Add user message
//     const userMessage = { role: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);

//     // Add assistant placeholder (will be filled token-by-token)
//     setMessages((prev) => [...prev, { role: "bot", text: "" }]);

//     setLoading(true);

//     try {
//       const response = await fetch("http://localhost:5678/api/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           // send API key if provided
//           ...(apiKey ? { "x-api-key": apiKey } : {}),
//         },
//         body: JSON.stringify({ question: input }),
//       });

//       if (response.status === 401) {
//         throw new Error("Unauthorized: Invalid API Key.");
//       }
//       if (!response.ok) {
//         // try to get text body for debugging
//         const errText = await response.text().catch(() => "");
//         throw new Error(
//           `HTTP error ${response.status} ${response.statusText} ${errText}`
//         );
//       }

//       // streaming read
//       const reader = response.body.getReader();
//       const decoder = new TextDecoder();
//       let buffer = "";

//       while (true) {
//         const { value, done } = await reader.read();
//         if (done) break;

//         buffer += decoder.decode(value, { stream: true });

//         // server uses messages separated by double-newline (\n\n)
//         const lines = buffer.split("\n\n");
//         buffer = lines.pop(); // keep incomplete part

//         for (const line of lines) {
//           if (line.startsWith("data:")) {
//             const jsonStr = line.substring(5).trim();
//             try {
//               const data = JSON.parse(jsonStr);
//               // if server sends tokens as { token: "..." } like your other app
//               if (data.token) {
//                 // append token to last assistant message
//                 setMessages((prev) =>
//                   prev.map((m, i) =>
//                     i === prev.length - 1
//                       ? { ...m, text: m.text + data.token }
//                       : m
//                   )
//                 );
//               } else if (data.finish) {
//                 // optional finish signal handling (no-op)
//               } else if (data.message || data.answer || data.text) {
//                 // fallback in case server sends a larger chunk
//                 const chunk = data.message ?? data.answer ?? data.text;
//                 setMessages((prev) =>
//                   prev.map((m, i) =>
//                     i === prev.length - 1 ? { ...m, text: m.text + chunk } : m
//                   )
//                 );
//               }
//             } catch (err) {
//               console.error("Failed to parse stream JSON:", err, line);
//             }
//           }
//         }
//       }
//     } catch (err) {
//       console.error("Stream error:", err);
//       // show error in the assistant placeholder
//       setMessages((prev) =>
//         prev.map((m, i) =>
//           i === prev.length - 1
//             ? { ...m, text: `**Error:** ${err.message}` }
//             : m
//         )
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Optional: quick "clear chat" helper
//   const clearChat = () => {
//     setMessages([{ role: "bot", text: "Hi 👋 How can I help you today?" }]);
//     try {
//       sessionStorage.removeItem("chat_history");
//     } catch (e) {
//       /* ignore */
//     }
//   };

//   return (
//     <>
//       <div className="chatbot-widget">
//         {isOpen && (
//           <div className={`chatbot-window ${isFullscreen ? "fullscreen" : ""}`}>
//             <div className="chatbot-header">
//               <span>ChatBot</span>
//               <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
//                 <input
//                   type="password"
//                   placeholder="API Key (optional)"
//                   value={apiKey}
//                   onChange={(e) => setApiKey(e.target.value)}
//                   style={{
//                     fontSize: 12,
//                     padding: "6px 8px",
//                     borderRadius: 6,
//                     border: "1px solid rgba(255,255,255,0.2)",
//                     background: "rgba(255,255,255,0.08)",
//                     color: "white",
//                     width: 200,
//                   }}
//                 />
//                 <div className="header-buttons">
//                   <button onClick={() => setIsFullscreen((f) => !f)}>
//                     {isFullscreen ? "🗗" : "🗖"}
//                   </button>
//                   <button onClick={() => setIsOpen(false)}>✖</button>
//                 </div>
//               </div>
//             </div>

//             <div className="chatbot-messages">
//               <ChatMessages messages={messages} />
//               {loading && (
//                 <div className="chat-msg bot-msg">⏳ Thinking...</div>
//               )}
//               <div ref={messagesEndRef} />
//             </div>

//             <div className="chatbot-input">
//               <ChatInput onSend={handleSendMessage} loading={loading} />
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   marginTop: 6,
//                 }}
//               >
//                 <button onClick={clearChat} style={{ fontSize: 12 }}>
//                   Clear
//                 </button>
//                 <small style={{ fontSize: 11, color: "#666" }}>
//                   Server: http://localhost:5678/api/chat
//                 </small>
//               </div>
//             </div>
//           </div>
//         )}

//         {!isOpen && (
//           <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
//             💬
//           </button>
//         )}
//       </div>
//     </>
//   );
// }

// export default ChatbotWidget;



// ChatbotWidget.jsx
import React, { useState, useEffect, useRef } from "react";
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

  // handle sending message with streaming (SSE-like) response handling
  const handleSendMessage = async (input) => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Add assistant placeholder (will be filled token-by-token)
    setMessages((prev) => [...prev, { role: "bot", text: "" }]);

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5678/api/chat", {
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
        // try to get text body for debugging
        const errText = await response.text().catch(() => "");
        throw new Error(`HTTP error ${response.status} ${response.statusText} ${errText}`);
      }

      // streaming read
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // server uses messages separated by double-newline (\n\n)
        const lines = buffer.split("\n\n");
        buffer = lines.pop(); // keep incomplete part

        for (const line of lines) {
          if (line.startsWith("data:")) {
            const jsonStr = line.substring(5).trim();
            try {
              const data = JSON.parse(jsonStr);
              // if server sends tokens as { token: "..." } like your other app
              if (data.token) {
                // append token to last assistant message
                setMessages((prev) =>
                  prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, text: m.text + data.token } : m
                  )
                );
              } else if (data.finish) {
                // optional finish signal handling (no-op)
              } else if (data.message || data.answer || data.text) {
                // fallback in case server sends a larger chunk
                const chunk = data.message ?? data.answer ?? data.text;
                setMessages((prev) =>
                  prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, text: m.text + chunk } : m
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
      // show error in the assistant placeholder
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

  // Optional: quick "clear chat" helper
  const clearChat = () => {
    setMessages([{ role: "bot", text: "Hi 👋 How can I help you today?" }]);
    try {
      sessionStorage.removeItem("chat_history");
    } catch (e) {
      /* ignore */
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
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <button onClick={clearChat} style={{ fontSize: 12 }}>Clear</button>
                <small style={{ fontSize: 11, color: "#666" }}>Server: http://localhost:5678/api/chat</small>
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
    </>
  );
}

export default ChatbotWidget;
