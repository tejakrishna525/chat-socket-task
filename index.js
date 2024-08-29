const io = require('socket.io-client');

// Replace 'localhost:5000' with your server's address
const socket = io('http://localhost:8000', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmNlZDdkMWVmMDlhZGQxMWVmNTJjMzIiLCJpYXQiOjE3MjQ4NTExNjEsImV4cCI6MTcyNDg1NDc2MX0.wEtughFrLgUl_MY4OzZ30MLfum-XyG965F2dsaQk_kg'  // Replace with the actual JWT token
  }
});

socket.on('connection', () => {
  console.log('Connected to server');

  // Send a test message
  socket.emit('message', { text: 'Hello, World!' });
});

socket.on('message', (message) => {
  console.log('Received message:', message);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
