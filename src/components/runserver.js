import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../assets/css/runserver.css';


const socket = io('http://localhost:5000'); // Ensure this matches your main server URL

const ServerControl = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    socket.on('serverLog', (log) => {
      setLogs((prevLogs) => [...prevLogs, log]);
    });

    return () => {
      socket.off('serverLog');
    };
  }, []);

  const startServer = () => {
    socket.emit('startServer');
  };

  return (
    <div className="container">
      <h1 className='text-runserver'>Server Control Panel</h1>
      <button className='btn btn-outline-success btn-lg' onClick={startServer}>Start Server</button>
      <div id="logs" className="logs">
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </div>
  );
};

export default ServerControl;
