import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AIChat from '../components/AIChat';

const Chat = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserAndConversations = async () => {
      try {
        const token = localStorage.getItem('token');
        const userRes = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        let chatUsers = [];
        if (userRes.data.user.role === 'gym') {
          const trainersRes = await axios.get(
            `http://localhost:5000/api/gym/trainers/${userRes.data.profile._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          chatUsers = trainersRes.data.map(trainer => ({
            id: trainer._id,
            name: trainer.name,
            role: 'trainer',
          }));
        } else if (userRes.data.user.role === 'trainer') {
          if (userRes.data.profile.gym) {
            const gymRes = await axios.get(
              `http://localhost:5000/api/user/gyms/${userRes.data.profile.gym}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const membersRes = await axios.get(
              `http://localhost:5000/api/gym/members/${userRes.data.profile.gym}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            chatUsers = [
              { id: gymRes.data._id, name: gymRes.data.name, role: 'gym' },
              ...membersRes.data.map(member => ({
                id: member._id,
                name: member.name,
                role: 'member',
              })),
            ];
          }
        } else if (userRes.data.user.role === 'member') {
          if (userRes.data.profile.gym) {
            try {
              const gymRes = await axios.get(
                `http://localhost:5000/api/user/gyms/${userRes.data.profile.gym}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              const trainersRes = await axios.get(
                `http://localhost:5000/api/body-progress/trainers/${userRes.data.profile.gym}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              chatUsers = trainersRes.data.map(trainer => ({
                id: trainer._id,
                name: trainer.name,
                role: 'trainer',
              }));
            } catch (err) {
              console.error('Error fetching trainers:', err.response?.data || err.message);
              // Handle the error gracefully
              chatUsers = [];
            }
          }
        }
        setUsers(chatUsers);
      } catch (err) {
        setError('Failed to fetch chat users');
      }
    };
    fetchUserAndConversations();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        try {
          const token = localStorage.getItem('token');
          const userRes = await axios.get('http://localhost:5000/api/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const userId = userRes.data.user.id;
          const otherUserId = selectedUser.id;
          const response = await axios.get(
            `http://localhost:5000/api/chat/messages/${otherUserId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMessages(response.data);
        } catch (err) {
          setError('Failed to fetch messages');
        }
      };
      fetchMessages();
    }
  }, [selectedUser]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/chat/send',
        {
          recipientId: selectedUser.id,
          recipientRole: selectedUser.role,
          message: newMessage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Message sent successfully');
      setNewMessage('');

      const userRes = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userId = userRes.data.user.id;
      const response = await axios.get(
        `http://localhost:5000/api/chat/messages/${selectedUser.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(response.data);
      setError('');
    } catch (err) {
      setError('Failed to send message');
      setSuccess('');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Chat</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <div className="flex space-x-4">
        <div className="w-1/3">
          <h3 className="text-xl font-bold mb-4">Conversations</h3>
          <button
            onClick={() => {
              setShowAIChat(true);
              setSelectedUser(null);
            }}
            className="w-full text-left p-2 bg-blue-100 rounded mb-2 hover:bg-blue-200"
          >
            Vibush (AI)
          </button>
          {users.length === 0 ? (
            <p className="text-gray-500">No users available to chat with.</p>
          ) : (
            users.map(chatUser => (
              <button
                key={chatUser.id}
                onClick={() => {
                  setSelectedUser(chatUser);
                  setShowAIChat(false);
                }}
                className={`w-full text-left p-2 rounded mb-2 ${
                  selectedUser?.id === chatUser.id ? 'bg-blue-200' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {chatUser.name} ({chatUser.role})
              </button>
            ))
          )}
        </div>

        <div className="w-2/3">
          {showAIChat ? (
            <AIChat />
          ) : selectedUser ? (
            <div className="border rounded p-4">
              <h3 className="text-xl font-bold mb-4">Chat with {selectedUser.name}</h3>
              <div className="h-96 overflow-y-auto mb-4 p-2 border rounded">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-2 ${msg.senderRole === user?.user.role ? 'text-right' : 'text-left'}`}
                  >
                    <span
                      className={`inline-block p-2 rounded-lg ${
                        msg.senderRole === user?.user.role ? 'bg-blue-500 text-white' : 'bg-gray-200'
                      }`}
                    >
                      {msg.message}
                    </span>
                    <div className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Select a user or Vibush to start chatting.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;