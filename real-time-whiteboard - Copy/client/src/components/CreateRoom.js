import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

class Room {
  constructor({ roomId, code, createdBy }) {
    this.roomId = roomId;
    this.code = code;
    this.createdBy = createdBy;
  }
}

const CreateRoom = () => {
  const [createdBy, setCreatedBy] = useState('');

  const handleCreateRoom = async () => {
    if (!createdBy) return;

    const roomId = uuidv4();
    const code = uuidv4(); // Generate a unique code

    const newRoom = new Room({ roomId, code, createdBy });

    try {
      const response = await fetch('http://localhost:5000/<correct-endpoint>', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ createdBy, code }),
      });

      const data = await response.json();
      console.log('Room Created:', data);
      alert(`Room Created! Code: ${data.code}`);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Create Room</h2>
      <input
        type="text"
        placeholder="Your Name"
        value={createdBy}
        onChange={(e) => setCreatedBy(e.target.value)}
        style={{ padding: '10px', marginRight: '10px' }}
      />
      <button onClick={handleCreateRoom} style={{ padding: '10px 20px' }}>
        Create Room
      </button>
    </div>
  );
};

export default CreateRoom;

// const cors = require('cors');
// app.use(cors({ origin: 'http://localhost:3000' }));
