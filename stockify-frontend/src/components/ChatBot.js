import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';
import './ChatBot.css';

const formatTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 **Welcome to Stockify AI!**\n\nI'm your personal market assistant. Ask me about stock prices, sector analysis, or technical concepts like RSI and MACD. How can I help you today?",
      sender: 'bot',
      time: formatTime(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [contextSymbol, setContextSymbol] = useState(null);
  
  const quickActions = [
    { label: "Analyze RELIANCE", query: "Can you analyze RELIANCE.NS?" },
    { label: "Top Sectors", query: "Which sectors are performing best?" },
    { label: "What is RSI?", query: "Explain RSI indicator in simple terms" },
    { label: "Compare HDFC & SBI", query: "Compare HDFC Bank and SBI" },
    { label: "Defense Stocks", query: "Tell me about Defense sector stocks" }
  ];
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (overrideText) => {
    const textToSend = typeof overrideText === 'string' ? overrideText : inputMessage;
    const trimmed = textToSend.trim();
    if (!trimmed || isTyping) return;

    const userMsg = {
      id: Date.now(),
      text: trimmed,
      sender: 'user',
      time: formatTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const { data } = await api.post('/chat', { 
        message: trimmed,
        contextSymbol: contextSymbol 
      });
      
      const botMsg = {
        id: Date.now() + 1,
        text: data?.response || "⚠️ Sorry, I received an empty response. Please try again.",
        sender: 'bot',
        time: formatTime(),
      };
      
      setMessages((prev) => [...prev, botMsg]);
      if (data?.contextSymbol) {
        setContextSymbol(data.contextSymbol);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg = {
        id: Date.now() + 1,
        text: "⚠️ Sorry, I'm having trouble connecting right now. Please try again in a moment!",
        sender: 'bot',
        time: formatTime(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickAction = (query) => {
    sendMessage(query);
  };

  return (
    <div className="chatbot-container">
      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="bot-avatar">🤖</div>
            <div>
              <h3>Stockify AI Assistant</h3>
              <span className="chat-status">Always Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                <div className="message-content">
                  {msg.sender === 'bot' ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
                <span className="message-time">{msg.time}</span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="typing-indicator">
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>Bot is typing</span>
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-bar">
            {quickActions.map((action, idx) => (
              <button 
                key={idx} 
                className="quick-action-chip"
                onClick={() => handleQuickAction(action.query)}
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            <input
              ref={inputRef}
              className="chat-input"
              type="text"
              placeholder="Ask about stocks, sectors, RSI..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
            />
            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isTyping}
              title="Send Message"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        className={`chat-toggle-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        title={isOpen ? 'Close Chat' : 'Chat with Stockify AI'}
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
};

export default ChatBot;
