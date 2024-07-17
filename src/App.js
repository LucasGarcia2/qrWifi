import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './App.css';
import logo from './assets/logo.png';

const QRCodeSwitcher = () => {
  const [currentQR, setCurrentQR] = useState('');

  useEffect(() => {
    const fetchCurrentQR = async () => {
      try {
        const response = await axios.get('/current-qr');
        setCurrentQR(response.data.qrCode);
      } catch (error) {
        console.error('Error al obtener el código QR actual', error);
      }
    };

    fetchCurrentQR();

    const socket = io();
    socket.on('qrCodeChanged', (newQRCode) => {
      setCurrentQR(newQRCode);
      // Recargar la página para reflejar el nuevo QR
      window.location.reload();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="qr-code-container">
      {currentQR && <img src={currentQR} alt="Código QR" className="qr-code" />}
    </div>
  );
};

const App = () => {
  return (
    <div className="App">
      <header className="app-header">
        <img src={logo} alt="San Juan Innova Logo" className="app-logo" />
        <div className="app-title-container">
          <h1 className="app-title">San Juan Innova S.E</h1>
          <p className="app-welcome-message">Bienvenido al portal de conexión WiFi.</p>
        </div>
      </header>
      <QRCodeSwitcher />
    </div>
  );
};

export default App;
