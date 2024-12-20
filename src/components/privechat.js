import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../assets/css/chatroom.css';
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
        <div className="chat-container col-md-12">
            <div className="pt-2 pb-3 text-bg">
                <h1>Private Chat</h1>
                <p>Your ID: {myId}</p>
            </div>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <strong>{msg.from}: </strong> {msg.message}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={toUser}
                onChange={(e) => setToUser(e.target.value)}
                placeholder="ID of user to chat with"
                className="form-control"
                style={{ width: "80%" }}
            />
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="form-control"
                style={{ width: "80%" }}
            />
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message"
                className="form-control"
                style={{ width: "80%" }}
            />
            <div className='col-md-12 pb-4 d-flex justify-content-center'>
                <button className="btn btn-primary col-md-6 btn-lg" onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default PrivateChat;
