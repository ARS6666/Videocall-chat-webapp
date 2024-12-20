import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../assets/css/chatroom.css';

const socket = io('http://localhost:5000'); // Replace with your server URL

const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [toUser, setToUser] = useState('');
    const [myId, setMyId] = useState('');

    useEffect(() => {
        socket.on('connect', () => {
            setMyId(socket.id);
            console.log('Connected with ID:', socket.id);
        });

        socket.on('receiveMessage', (data) => {
            setMessages((prevMessages) => [...prevMessages, { from: data.from, message: data.message }]);
        });

        return () => {
            socket.off('connect');
            socket.off('receiveMessage');
        };
    }, []);

    const sendMessage = () => {
        if (message && toUser) {
            socket.emit('sendMessage', { message, to: toUser });
            setMessages((prevMessages) => [...prevMessages, { from: 'You', message }]);
            setMessage('');
        }
    };

    return (
        <div className="chat-container">
            <div className='pt-2 pb-3'>
                <div className='text-bg'>
                    <h1>Chat Room</h1>
                    <p>Your ID: {myId}</p>
                </div>
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
                style={{width:"80%"}}
            />
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message"
                className="form-control"
                style={{width:"80%"}}
            />
            <div className='col-md-12 pb-4 d-flex justify-content-center'>
                <button className="btn btn-primary col-md-6 btn-lg" onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatRoom;
