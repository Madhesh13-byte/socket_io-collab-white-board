// src/App.js
import React, { useState } from 'react';
import './index.css';

function App() {
  const [roomCode, setRoomCode] = useState('');
  const [createName, setCreateName] = useState('');
  const [joinName, setJoinName] = useState('');

  const handleCreateRoom = async () => {
    const res = await fetch('http://localhost:5000/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ createdBy: createName }),
    });
    const data = await res.json();
    alert(`Room Created! Code: ${data.code}`);
  };

  const handleJoinRoom = async () => {
    const res = await fetch(`http://localhost:5000/api/rooms/${roomCode}`);
    const data = await res.json();

    if (data.code) {
      alert(`Welcome ${joinName}, joined room: ${data.code}`);
    } else {
      alert("Room not found!");
    }
  };

  return (
    <div className="app">
      <h1>🎨 Real-Time Whiteboard</h1>

      <div className="form-container">
        <h2>Create Room</h2>
        <input
          type="text"
          placeholder="Your Name"
          value={createName}
          onChange={(e) => setCreateName(e.target.value)}
        />
        <button onClick={handleCreateRoom}>Create</button>
      </div>

      <div className="form-container">
        <h2>Join Room</h2>
        <input
          type="text"
          placeholder="Your Name"
          value={joinName}
          onChange={(e) => setJoinName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />
        <button onClick={handleJoinRoom}>Join</button>
      </div>
    </div>
  );
}

export default App;
