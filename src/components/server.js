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

  socket.on('callUser', (data) => {
    console.log('Calling user:', data);
    io.to(data.userToCall).emit('callUser', { signal: data.signalData, from: data.from });
  });

  socket.on('answerCall', (data) => {
    console.log('Answering call:', data);
    io.to(data.to).emit('callAccepted', data.signal);
  });

  socket.on('sendMessage', (data) => {
    io.to(data.to).emit('receiveMessage', { message: data.message, from: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
