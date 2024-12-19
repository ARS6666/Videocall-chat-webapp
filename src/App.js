import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

const socket = io('http://localhost:5000'); // Replace with your server URL

const App = () => {
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState('');
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [idToCall, setIdToCall] = useState('');
  const [myId, setMyId] = useState('');

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
      if (myVideo.current) {
        myVideo.current.srcObject = stream;
      }
    });

    socket.on('connect', () => {
      setMyId(socket.id);
      console.log('Connected with ID:', socket.id);
    });

    socket.on('callUser', (data) => {
      console.log('Receiving call from:', data.from);
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });

    socket.on('callAccepted', (signal) => {
      console.log('Call accepted');
      setCallAccepted(true);
      connectionRef.current.signal(signal);
    });
  }, []);

  const callUser = (id) => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (data) => {
      console.log('Sending call to:', id);
      socket.emit('callUser', { userToCall: id, signalData: data, from: myId });
    });

    peer.on('stream', (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
        console.log('Received stream from peer'); // Debugging log
      }
    });

    peer.on('error', (err) => {
      console.error('Peer connection error:', err);
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (data) => {
      console.log('Answering call');
      socket.emit('answerCall', { signal: data, to: caller });
    });

    peer.on('stream', (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
        console.log('Received stream from caller'); // Debugging log
      }
    });

    peer.on('error', (err) => {
      console.error('Peer connection error:', err);
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  return (
    <div className="App">
      <h1>Video Call App</h1>
      <div className="video-container">
        <div className="video">
          {stream && <video playsInline ref={myVideo} autoPlay style={{ width: '300px' }} />}
        </div>
        <div className="video">
          {callAccepted && !callEnded ? (
            <video playsInline ref={userVideo} autoPlay style={{ width: '300px' }} />
          ) : null}
        </div>
      </div>
      <div className="controls">
        <p>Your ID: {myId}</p>
        <input
          type="text"
          value={idToCall}
          onChange={(e) => setIdToCall(e.target.value)}
          placeholder="ID to call"
          className='form-control col-md-6'
        />
        <button className='btn btn-success pt-2' onClick={() => callUser(idToCall)}>Call</button>
        {receivingCall && !callAccepted ? (
          <div className="caller">
            <h1>{caller} is calling...</h1>
            <button className='btn btn-success pt-2' onClick={answerCall}>Answer</button>
          </div>
        ) : null}
        {callAccepted && !callEnded ? (
          <button className='btn btn-danger pt-2' onClick={leaveCall}>End Call</button>
        ) : null}
      </div>
    </div>
  );
};

export default App;
