import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../assets/css/groupchat.css';
import url from "../config.json";

const socket = io(url.baseUrl); // Ensure this matches your server URL

const GroupChat = () => {
    const [groupMessages, setGroupMessages] = useState([]);
    const [groupMessage, setGroupMessage] = useState('');
    const [name, setName] = useState('');
    const [groupName, setGroupName] = useState('');
    const [newGroupName, setNewGroupName] = useState('');
    const [groups, setGroups] = useState([]);
    const [myId, setMyId] = useState('');

    useEffect(() => {
        socket.on('connect', () => {
            setMyId(socket.id);
            console.log('Connected with ID:', socket.id);
        });

        socket.on('groupList', (groupList) => {
            setGroups(groupList);
        });

        socket.on('receiveGroupMessage', (data) => {
            setGroupMessages((prevMessages) => [...prevMessages, { from: data.name, message: data.message }]);
        });

        socket.on('groupJoined', (groupName) => {
            console.log(`Joined group ${groupName}`);
        });

        socket.on('groupCreated', (groupName) => {
            console.log(`Created group ${groupName}`);
            setGroupName(groupName); // Automatically join the newly created group
        });

        socket.on('error', (message) => {
            alert(message);
        });

        return () => {
            socket.off('connect');
            socket.off('groupList');
            socket.off('receiveGroupMessage');
            socket.off('groupJoined');
            socket.off('groupCreated');
            socket.off('error');
        };
    }, []);

    const joinGroup = () => {
        if (groupName) {
            socket.emit('joinGroup', groupName);
            setGroupMessages([]); // Clear messages when joining a new group
        }
    };

    const createGroup = () => {
        if (newGroupName) {
            socket.emit('createGroup', newGroupName);
            setNewGroupName('');
        }
    };

    const sendGroupMessage = () => {
        if (groupMessage && groupName && name) {
            socket.emit('sendGroupMessage', { name, message: groupMessage, groupName });
            setGroupMessage(''); // Clear the input field after sending the message
        }
    };

    return (
        <div className="col-md-12 d-flex justify-content-center row m-0">
            <div className='col-md-12 d-flex justify-content-center pt-2 pb-3'>
                <div className="text-bg col-md-2" >
                    <h1>Group Chat</h1>
                    <p>Your ID: {myId}</p>
                </div>
            </div>
            <div className='col-md-12 row m-0'>
                <div className='col-md-3' >
                    <div className='col-md-12 border border-10 p-3' style={{ borderRadius: "10px" }}>
                        <h2 className='text-white'>Create New Group</h2>
                        <input
                            type="text"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            placeholder="Enter new group name"
                            className="form-control-lg col-md-12"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") createGroup();
                            }}
                        />
                        <div className='col-md-12 pb-4 d-flex justify-content-center'>
                            <button className="btn btn-primary col-md-6 btn-lg" onClick={createGroup}>Create Group</button>
                        </div>
                    </div>
                    <div className='col-md-12 pt-3' style={{ borderRadius: "10px" }} >
                        <div className='col-md-12 border border-10 p-3 text-white' style={{ borderRadius: "10px" }} >
                            <h2>Available Groups</h2>
                            <ul>
                                {groups.map((group, index) => (
                                    <li key={index}>{group}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 bg-white border p-2" style={{ borderRadius: "10px", height: "300px", overflowY: "auto" }}>
                    {groupMessages.map((msg, index) => (
                        <div key={index} className="group-message bg-white p-3 border-bottom">
                            <strong>{msg.from}: </strong> {msg.message}
                        </div>
                    ))}
                </div>
                <div className="col-md-3 text-white">
                    <h2>Join Group</h2>
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Enter group name to join"
                        className="form-control-lg col-md-12"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") joinGroup();
                        }}
                    />
                    <div className='col-md-12 pb-4 d-flex justify-content-center'>
                        <button className="btn btn-primary col-md-6 btn-lg" onClick={joinGroup}>Join Group</button>
                    </div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="form-control-lg col-md-12"
                    />
                    <input
                        type="text"
                        value={groupMessage}
                        onChange={(e) => setGroupMessage(e.target.value)}
                        placeholder="Type your group message"
                        className="form-control-lg col-md-12"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") sendGroupMessage();
                        }}
                    />
                    <div className='col-md-12 pb-4 d-flex justify-content-center'>
                        <button className="btn btn-primary col-md-6 btn-lg" onClick={sendGroupMessage}>Send to Group</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupChat;
