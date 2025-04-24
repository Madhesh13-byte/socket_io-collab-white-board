// client/src/components/Whiteboard.js
import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import ChatBox from './ChatBox';

const Whiteboard = ({ roomCode, username }) => {
  const canvasRef = useRef(null);
  const socketRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(4);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 4;

    socketRef.current = io('http://localhost:5000');

    socketRef.current.emit('join-room', roomCode);

    socketRef.current.on('drawing', ({ x0, y0, x1, y1, color, width }) => {
      drawLine(x0, y0, x1, y1, color, width, false);
    });

    socketRef.current.on('clear-canvas', () => {
      clearLocalCanvas();
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomCode]);

  const getColor = () => (tool === 'pen' ? color : '#ffffff');
  const getLineWidth = () => (tool === 'pen' ? brushSize : 20);

  const drawLine = (x0, y0, x1, y1, color, width, emit) => {
    const context = canvasRef.current.getContext('2d');
    context.strokeStyle = color;
    context.lineWidth = width;

    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
    context.closePath();

    if (!emit) return;

    socketRef.current.emit('drawing', {
      roomId: roomCode,
      data: { x0, y0, x1, y1, color, width },
    });
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    canvasRef.current.lastX = offsetX;
    canvasRef.current.lastY = offsetY;
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;

    const x0 = canvasRef.current.lastX;
    const y0 = canvasRef.current.lastY;
    const x1 = offsetX;
    const y1 = offsetY;

    drawLine(x0, y0, x1, y1, getColor(), getLineWidth(), true);

    canvasRef.current.lastX = x1;
    canvasRef.current.lastY = y1;
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const clearLocalCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleClearCanvas = () => {
    clearLocalCanvas();
    socketRef.current.emit('clear-canvas', roomCode);
  };

  return (
    <>
      <div className="tool-buttons">
        <button
          className={tool === 'pen' ? 'active' : ''}
          onClick={() => setTool('pen')}
        >
          Pen
        </button>
        <button
          className={tool === 'eraser' ? 'active' : ''}
          onClick={() => setTool('eraser')}
        >
          Eraser
        </button>
        <button onClick={handleClearCanvas}>Clear Canvas</button>

        {tool === 'pen' && (
          <>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ marginLeft: '1rem', cursor: 'pointer' }}
            />

            <div style={{ marginLeft: '1rem', display: 'inline-block' }}>
              <label htmlFor="brushSize">Brush Size: </label>
              <input
                id="brushSize"
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                style={{ verticalAlign: 'middle' }}
              />
              <span style={{ marginLeft: '0.5rem' }}>{brushSize}px</span>
            </div>
          </>
        )}
      </div>

      <canvas
        ref={canvasRef}
        style={{ border: '1px solid #ccc', background: '#fff' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />

      {/* ✅ Chat below the whiteboard */}
      <div style={{ marginTop: '1rem' }}>
        <ChatBox roomCode={roomCode} username={username} />
      </div>
    </>
  );
};

export default Whiteboard;
