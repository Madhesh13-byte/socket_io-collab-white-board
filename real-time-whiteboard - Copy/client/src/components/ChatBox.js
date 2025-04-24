import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Adjust if needed

const ChatBox = ({ roomCode, username }) => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.emit('join-room', roomCode);

    socket.on('chat-message', (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off('chat-message');
    };
  }, [roomCode]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chat-message', {
        roomId: roomCode,
        username,
        message
      });
      setMessage('');
    }
  };

  return (
    <div style={{ marginTop: '2rem', maxWidth: 400, margin: 'auto' }}>
      <h3>💬 Chat</h3>
      <div style={{ background: '#fff', padding: '1rem', borderRadius: '10px', height: '200px', overflowY: 'auto' }}>
        {chat.map((msg, index) => (
          <div key={index}><strong>{msg.username}</strong>: {msg.message}</div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ marginTop: '1rem' }}>
        <input
          type="text"
          value={message}
          placeholder="Type your message..."
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: '80%', padding: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem' }}>Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
