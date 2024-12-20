import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../assets/css/privatechat.css';
import url from "../config.json";

const socket = io(url.baseUrl); // Ensure this matches your server URL

const PrivateChat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [toUser, setToUser] = useState('');
    const [myId, setMyId] = useState('');

    useEffect(() => {
        socket.on('connect', () => {
            setMyId(socket.id);
            console.log('Connected with ID:', socket.id);
        });

        socket.on('receiveMessage', (data) => {
            setMessages((prevMessages) => [...prevMessages, { from: data.name, message: data.message }]);
        });

        return () => {
            socket.off('connect');
            socket.off('receiveMessage');
        };
    }, []);

    const sendMessage = () => {
        if (message && toUser && name) {
            socket.emit('sendMessage', { name, message, to: toUser });
            setMessages((prevMessages) => [...prevMessages, { from: 'You', message }]);
            setMessage('');
        }
    };

    return (
        <div className="col-md-12 d-flex justify-content-center row m-0">
            <div className='col-md-12 d-flex justify-content-center pt-3'>
                <div className="pt-2 pb-3 text-bg col-md-3">
                    <h1>Private Chat</h1>
                    <p>Your ID: {myId}</p>
                </div>
            </div>
            <div className='col-md-12 pt-3 d-flex justify-content-center'>
                <div className="col-md-8 bg-white border" style={{ borderRadius: "10px", height: "300px", overflowY: "auto" }}>
                    {messages.map((msg, index) => (
                        <div key={index} className="group-message bg-white p-3 border-bottom">
                            <strong>{msg.from}: </strong> {msg.message}
                        </div>
                    ))}
                </div>
            </div>
            <div className='col-md-4 pt-3'>
                <input
                    type="text"
                    value={toUser}
                    onChange={(e) => setToUser(e.target.value)}
                    placeholder="ID of user to chat with"
                    className="form-control-lg col-md-12"
                />
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="form-control-lg col-md-12"
                />
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message"
                    className="form-control-lg col-md-12"
                />
                <div className='col-md-12 pb-4 d-flex justify-content-center'>
                    <button className="btn btn-primary col-md-12 btn-lg" onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default PrivateChat;
