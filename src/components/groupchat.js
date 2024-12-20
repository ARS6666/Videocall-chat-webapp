import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../assets/css/chatroom.css';
import url from "../config.json";

const socket = io(url.baseUrl); // Ensure this matches your server URL

const GroupChat = () => {
    const [groupMessages, setGroupMessages] = useState([]);
    const [groupMessage, setGroupMessage] = useState('');
    const [name, setName] = useState('');
    const [groupID, setGroupID] = useState('');
    const [myId, setMyId] = useState('');

    useEffect(() => {
        socket.on('connect', () => {
            setMyId(socket.id);
            console.log('Connected with ID:', socket.id);
        });

        socket.on('receiveGroupMessage', (data) => {
            setGroupMessages((prevMessages) => [...prevMessages, { from: data.name, message: data.message }]);
        });

        return () => {
            socket.off('connect');
            socket.off('receiveGroupMessage');
        };
    }, []);

    const joinGroup = () => {
        if (groupID) {
            socket.emit('joinGroup', groupID);
        }
    };

    const sendGroupMessage = () => {
        if (groupMessage && groupID && name) {
            socket.emit('sendGroupMessage', { name, message: groupMessage, groupID });
            setGroupMessages((prevMessages) => [...prevMessages, { from: 'You', message: groupMessage }]);
            setGroupMessage('');
        }
    };

    return (
        <div className="chat-container col-md-12">
            <div className="pt-2 pb-3 text-bg">
                <h1>Group Chat</h1>
                <p>Your ID: {myId}</p>
            </div>
            <div className="group-messages">
                {groupMessages.map((msg, index) => (
                    <div key={index} className="group-message">
                        <strong>{msg.from}: </strong> {msg.message}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={groupID}
                onChange={(e) => setGroupID(e.target.value)}
                placeholder="Enter group chat ID"
                className="form-control"
                style={{ width: "80%" }}
            />
            <div className='col-md-12 pb-4 d-flex justify-content-center'>
                <button className="btn btn-primary col-md-6 btn-lg" onClick={joinGroup}>Join Group</button>
            </div>
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
                value={groupMessage}
                onChange={(e) => setGroupMessage(e.target.value)}
                placeholder="Type your group message"
                className="form-control"
                style={{ width: "80%" }}
            />
            <div className='col-md-12 pb-4 d-flex justify-content-center'>
                <button className="btn btn-primary col-md-6 btn-lg" onClick={sendGroupMessage}>Send to Group</button>
            </div>
        </div>
    );
};

export default GroupChat;
