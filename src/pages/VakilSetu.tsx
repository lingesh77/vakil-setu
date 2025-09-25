import React, { useRef, useState } from 'react';

const botReplies: Record<string, string> = {
  hi: "Hello! I'm your legal assistant. Ask me anything.",
  hello: "Hi there! How can I help?",
  "who created you": "I was created by Vakil Setu.",
  "what's your name": "I'm Vakil Setu AI – your legal assistant.",
  "how are you": "I'm always ready to assist you with legal queries!",
};

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

const VakilSetu: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState('en');
  const chatRef = useRef<HTMLDivElement>(null);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    setMessages(prev => [...prev, { text, sender }]);
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
      }
    }, 100);
  };

  const sendMessage = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    addMessage(trimmed, 'user');
    setInputText('');

    const lower = trimmed.toLowerCase();
    if (botReplies[lower]) {
      setTimeout(() => addMessage(botReplies[lower], 'bot'), 500);
    } else {
      getSearchResponse(trimmed);
    }
  };

  const getSearchResponse = async (query: string) => {
    const API_KEY = 'AIzaSyAJYTVOccWQ9CkxVeiGRNqePXJX83RKeeQ';
    const CX = '519eb9ea0d5394e44';

    try {
      const res = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        const item = data.items[0];
        const reply = `${item.title}\n${item.snippet}\n${item.link}`;
        addMessage(reply, 'bot');
      } else {
        addMessage("❌ Sorry, I couldn't find anything relevant.", 'bot');
      }
    } catch (error) {
      addMessage("⚠ Error fetching response.", 'bot');
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.start();
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setTimeout(() => sendMessage(), 100);
    };
  };

  return (
    <div className="container">
      <header>⚖ Vakil Setu – Legal AI Assistant</header>

      <div id="controls">
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="ta">Tamil</option>
        </select>
      </div>

      <div id="chat-container" ref={chatRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-container ${msg.sender}`}>
            <div className="avatar">{msg.sender === 'user' ? '🧑' : '⚖'}</div>
            <div className="message">{msg.text}</div>
          </div>
        ))}
      </div>

      <div id="input-area">
        <input
          type="text"
          id="user-input"
          placeholder="Type your legal query..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={startVoiceInput}>🎤</button>
        <button onClick={sendMessage}>Send</button>
      </div>

      {/* Inline styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        body, .container {
          margin: 0;
          font-family: 'Inter', sans-serif;
          background-color: #121212;
          color: #f1f1f1;
          display: flex;
          flex-direction: column;
          height: 100vh;
        }
        header {
          background-color: #1f1f1f;
          padding: 1rem;
          font-size: 1.4rem;
          font-weight: 700;
          text-align: center;
          color: #facc15;
        }
        #controls {
          background: #1f1f1f;
          padding: 0.6rem 1rem;
          display: flex;
        }
        #controls select {
          background: #262626;
          color: #f1f1f1;
          border: 1px solid #333;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 14px;
        }
        #chat-container {
          flex-grow: 1;
          padding: 1rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        .message-container {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 12px;
          max-width: 90%;
        }
        .message-container.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }
        .avatar {
          font-size: 1.8rem;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .message {
          padding: 0.3rem 0;
          font-size: 1rem;
          line-height: 1.5;
          white-space: pre-wrap;
          max-width: 100%;
        }
        #input-area {
          display: flex;
          padding: 1rem;
          background: #1f1f1f;
          border-top: 1px solid #333;
        }
        #user-input {
          flex-grow: 1;
          padding: 12px;
          font-size: 15px;
          border-radius: 10px;
          border: 1px solid #444;
          background: #262626;
          color: white;
          outline: none;
        }
        button {
          margin-left: 10px;
          background-color: #facc15;
          color: #000;
          border: none;
          border-radius: 10px;
          padding: 12px;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default VakilSetu;
