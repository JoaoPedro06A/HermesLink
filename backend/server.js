const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Permite conexões de qualquer origem (útil para desenvolvimento Expo)
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Dispositivo conectado ao DSN:', socket.id);

  // Quando o servidor recebe uma mensagem
  socket.on('send_message', (data) => {
    console.log('Mensagem recebida:', data);
    
    // Retransmite para todos os outros conectados
    socket.broadcast.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('Dispositivo desconectado');
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`SERVIDOR HERMESLINK OPERANTE NA PORTA ${PORT}`);
});