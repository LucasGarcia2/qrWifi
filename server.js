const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Rutas de los códigos QR
const qrCodes = [
  '/qrs/QR-Clientes1.png',
  '/qrs/QR-Clientes2.png',
  '/qrs/QR-Clientes3.png',
  '/qrs/QR-Clientes4.png',
  '/qrs/QR-Clientes5.png',
  '/qrs/QR-Clientes6.png',
  '/qrs/QR-Clientes7.png',
  '/qrs/QR-Clientes8.png',
  '/qrs/QR-Clientes9.png',
  '/qrs/QR-Clientes10.png',
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
};

// Iniciar el temporizador para cambiar el código QR cada 45 minutos
setInterval(switchQRCode, 45 * 60 * 1000);

// Servir archivos estáticos de la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Servir archivos estáticos de la carpeta 'build'
app.use(express.static(path.join(__dirname, 'build')));

// API para obtener el código QR actual
app.get('/current-qr', (req, res) => {
  res.json({ qrCode: qrCodes[currentQRIndex] });
});

// Manejar todas las demás rutas y devolver el archivo index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
