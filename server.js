const express = require('express');
const axios = require('axios');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 5000;

// Rutas de los códigos QR
const qrCodes = [
  '/qrs/QRClientes1.png',
  '/qrs/QRClientes2.png',
  '/qrs/QRClientes3.png',
  '/qrs/QRClientes4.png',
  '/qrs/QRClientes5.png',
  '/qrs/QRClientes6.png',
  '/qrs/QRClientes7.png',
  '/qrs/QRClientes8.png',
  '/qrs/QRClientes9.png',
  '/qrs/QRClientes10.png',
  // ... hasta 20 códigos QR
];

let currentQRIndex = 0;

const sendTelegramNotification = async (index) => {
  const botToken = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.REACT_APP_TELEGRAM_CHAT_ID;
  const message = `El código QR ha cambiado. Nuevo código: ${qrCodes[index]}`;

  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
    });
  } catch (error) {
    console.error('Error al enviar la notificación a Telegram', error);
  }
};

const switchQRCode = () => {
  currentQRIndex = (currentQRIndex + 1) % qrCodes.length;
  sendTelegramNotification(currentQRIndex);
  io.emit('qrCodeChanged', qrCodes[currentQRIndex]);
};

// Iniciar el temporizador para cambiar el código QR cada 45 minutos
setInterval(switchQRCode, 45 * 60 * 1000);

// Servir archivos estáticos de la carpeta 'public' y 'build'
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/current-qr', (req, res) => {
  res.json({ qrCode: qrCodes[currentQRIndex] });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
