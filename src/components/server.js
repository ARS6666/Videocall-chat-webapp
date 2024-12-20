const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.emit('yourID', socket.id);

  // Handle joining a group chat
  socket.on('joinGroup', (groupID) => {
    socket.join(groupID);
    console.log(`${socket.id} joined group ${groupID}`);
  });

  // Handle private calls
  socket.on('callUser', (data) => {
    io.to(data.userToCall).emit('callUser', { signal: data.signalData, from: data.from });
  });

  // Handle answering private calls
  socket.on('answerCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });

  // Handle private messages
  socket.on('sendMessage', (data) => {
    io.to(data.to).emit('receiveMessage', { name: data.name, message: data.message, from: socket.id });
  });

  // Handle group messages
  socket.on('sendGroupMessage', (data) => {
    io.to(data.groupID).emit('receiveGroupMessage', { name: data.name, message: data.message });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
