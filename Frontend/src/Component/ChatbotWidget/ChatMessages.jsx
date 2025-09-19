          
import { marked } from 'marked';
import DOMPurify from 'dompurify';

function ChatMessages({ messages }) {
  // The component should return the JSX directly
  return (
    <>
      {messages.map((msg, idx) => {
        // Handle bot messages: parse Markdown and sanitize
        if (msg.role === 'bot') {
          const rawHtml = marked.parse(msg.text);
          const sanitizedHtml = DOMPurify.sanitize(rawHtml);
          
          return (
            <div
              key={idx}
              className="chat-msg bot-msg"
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
          );
        }

        // Handle user messages: render as plain text
        // This was the part with the error. It should just return one div.
        return (
          <div key={idx} className="chat-msg user-msg">
            {msg.text}
          </div>
        );
      })}
    </>
  );
}

export default ChatMessages;