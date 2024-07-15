import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import logo from './assets/logo.png';

// Importar las imágenes QR desde la carpeta correcta
import qr1 from './qrs/qr1.png';
import qr2 from './qrs/qr2.png';
import qr3 from './qrs/qr3.png';
// Importar hasta 20 imágenes de QR
// import qr4 from './qrs/qr4.png';
// ...

const QRCodeSwitcher = () => {
  const qrCodes = [
    qr1,
    qr2,
    qr3,
    // ... hasta 20 códigos QR
  ];

  const [currentQRIndex, setCurrentQRIndex] = useState(0);

  const switchQRCode = useCallback(() => {
    setCurrentQRIndex((prevIndex) => (prevIndex + 1) % qrCodes.length);
    sendTelegramNotification();
  }, [qrCodes.length]);

  const sendTelegramNotification = useCallback(async () => {
    const botToken = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.REACT_APP_TELEGRAM_CHAT_ID;
    const message = `El código QR ha cambiado. Nuevo código: ${qrCodes[currentQRIndex]}`;

    try {
      await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: message,
      });
    } catch (error) {
      console.error('Error al enviar la notificación a Telegram', error);
    }
  }, [qrCodes, currentQRIndex]);

  useEffect(() => {
    const intervalId = setInterval(switchQRCode, 10 * 60 * 1000); // Cambia cada 1 minuto
    return () => clearInterval(intervalId);
  }, [switchQRCode]);

  return (
    <div className="qr-code-container">
      <img src={qrCodes[currentQRIndex]} alt="Código QR" className="qr-code" />
    </div>
  );
};

const App = () => {
  return (
    <div className="App">
      <header className="app-header">
        <img src={logo} alt="San Juan Innova Logo" className="app-logo" />
        <div className="app-title-container">
          <h1 className="app-title">San Juan Innova</h1>
          <p className="app-welcome-message">Bienvenido al portal de conexión WiFi.</p>
        </div>
      </header>
      <QRCodeSwitcher />
    </div>
  );
};

export default App;
