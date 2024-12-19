import 'bootstrap/dist/css/bootstrap.css';
import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';
import '../assets/css/webcam.css';
import '../assets/css/font/font.css';
import bg from "../assets/media/bg.jpg"; // Ensure this path is correct

const socket = io('https://videochat.liara.run:5000'); // Replace with your server URL

const App = () => {
    const [stream, setStream] = useState(null);
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState('');
    const [callerSignal, setCallerSignal] = useState('');
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [idToCall, setIdToCall] = useState('');
    const [myId, setMyId] = useState('');
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);

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
            if (connectionRef.current) {
                connectionRef.current.signal(signal);
            }
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
                console.log('Received stream from peer');
            }
        });

        peer.on('error', (err) => {
            console.error('Peer connection error:', err);
        });

        socket.on('callAccepted', (signal) => {
            setCallAccepted(true);
            if (peer) {
                peer.signal(signal);
            }
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
                console.log('Received stream from caller');
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
        if (connectionRef.current) {
            connectionRef.current.destroy();
        }
        setCallAccepted(false);
        setReceivingCall(false);
        setCaller('');
        setCallerSignal('');
        setIdToCall('');
    };

    const toggleMute = () => {
        if (stream) {
            stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
            setIsMuted(!isMuted);
        }
    };

    const toggleCamera = () => {
        if (stream) {
            stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
            setIsCameraOff(!isCameraOff);
        }
    };

    return (
        <>
            <div className="col-md-12 fontr text-center bg-Image">
                <h1>Video Call</h1>
                <div className="m-3 col-md-12 row m-0">
                    <div className="col-md-6 d-flex justify-content-end" style={{paddingRight:"40px"}}>
                        {stream && <video playsInline ref={myVideo} autoPlay style={{maxWidth:"500px" , maxHeight:"350px"}} />}
                    </div>
                    <div className=" col-md-6 d-flex justify-content-start" style={{paddingRight:"40px"}}>
                        {callAccepted && !callEnded ? (
                            <video playsInline ref={userVideo} autoPlay  style={{ maxWidth:"500px" , maxHeight:"350px" , backgroundColor:"black"}} />
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
                        className="form-control"
                    />
                    <button className="btn btn-success m-2" onClick={() => callUser(idToCall)}>Call</button>
                    {receivingCall && !callAccepted ? (
                        <div className="caller">
                            <h1>{caller} is calling...</h1>
                            <button className="btn btn-success m-2" onClick={answerCall}>Answer</button>
                        </div>
                    ) : null}
                    {callAccepted && !callEnded ? (
                        <>
                            <button className="btn btn-danger m-2" onClick={leaveCall}>End Call</button>
                            <button className="btn btn-secondary m-2" onClick={toggleMute}>
                                {isMuted ? 'Unmute' : 'Mute'}
                            </button>
                            <button className="btn btn-secondary m-2" onClick={toggleCamera}>
                                {isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
                            </button>
                        </>
                    ) : null}
                </div>
            </div>
        </>

    );
};

export default App;
