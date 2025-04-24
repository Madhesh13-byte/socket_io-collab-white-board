module.exports = (io) => {
    io.on('connection', (socket) => {
      console.log('✅ User connected');
  
      socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
  
        socket.on('draw', (data) => {
          socket.to(roomId).emit('draw', data);
        });
      });
  
      socket.on('disconnect', () => {
        console.log('❌ User disconnected');
      });
    });
  };
  