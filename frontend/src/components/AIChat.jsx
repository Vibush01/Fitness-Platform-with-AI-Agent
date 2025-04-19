import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Fetch chat history on mount
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/ai-agent/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    fetchChatHistory();
  }, []);

  const handleSendMessage = async () => {
    if (!query.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/ai-agent/chat',
        { query },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update messages with the user's query and AI response
      setMessages((prev) => [
        ...prev,
        { senderRole: 'member', message: query, timestamp: new Date() },
        { senderRole: 'ai', message: response.data.response, timestamp: new Date() },
      ]);
      setQuery('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Chat with Vibush</h2>
      <div className="border p-4 h-96 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${msg.senderRole === 'member' ? 'text-right' : 'text-left'}`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                msg.senderRole === 'member' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {msg.message}
            </span>
            <div className="text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Ask Vibush about diet, workouts, or fitness..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChat;