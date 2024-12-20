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

let groups = {}; // To keep track of available groups

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.emit('yourID', socket.id);

  // Send the list of groups to the newly connected user
  socket.emit('groupList', Object.keys(groups));

  // Handle joining a group chat
  socket.on('joinGroup', (groupName) => {
    if (groups[groupName]) {
      socket.join(groupName);
      console.log(`${socket.id} joined group ${groupName}`);
      socket.emit('groupJoined', groupName);
    } else {
      socket.emit('error', 'Group does not exist.');
    }
  });

  // Handle creating a new group chat
  socket.on('createGroup', (groupName) => {
    if (!groups[groupName]) {
      groups[groupName] = [];
      io.emit('groupList', Object.keys(groups)); // Notify all users of the new group
      socket.join(groupName);
      socket.emit('groupCreated', groupName);
      console.log(`Group ${groupName} created by ${socket.id}`);
    } else {
      socket.emit('error', 'Group name already taken.');
    }
  });

  // Handle group messages
  socket.on('sendGroupMessage', (data) => {
    io.to(data.groupName).emit('receiveGroupMessage', { name: data.name, message: data.message });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
