import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ParentNavBar from '../NavBars/ParentNavBar'
import './ChatRoom.css'; // Import the CSS file

const socket = io('http://localhost:3000'); // Replace with your server URL

function ChatRoom() {
    // Room State
    const [room, setRoom] = useState("");
    const [notification, setNotification] = useState("");
    const [senderName, setSenderName] = useState(""); // Added state for sender's name
    const [isConnected, setIsConnected] = useState(false); // State to track connection status
    const [user, setUser] = useState([])

    useEffect(() => {

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    // Messages States
    const [message, setMessage] = useState("");
    const [messagesReceived, setMessagesReceived] = useState([]);

    const joinRoom = () => {
        if (room !== "" && senderName !== "") {
            socket.emit("join_room", room);
            setNotification(`You joined room ${room}`);
            setIsConnected(true); // Set connection status to true
            setTimeout(() => {
                setNotification("");
            }, 3000); // Clear notification after 3 seconds
        }
    };

    const sendMessage = () => {
        const newMessage = { message, senderName }; // Create the message object
        setMessagesReceived(prevMessages => [...prevMessages, newMessage]); // Add the message to local chat room's messages
        socket.emit("send_message", { message, room, senderName }); // Emit the message to the server
        setMessage(""); // Clear input after sending message
    };


    useEffect(() => {
        socket.on("receive_message", (data) => {
            // Add the received message to the array
            setMessagesReceived(prevMessages => [...prevMessages, data]);
        });

        // Clean up event listeners when component unmounts
        return () => {
            socket.off("receive_message");
            socket.off("user_joined");
        };
    }, [socket]);

    // Render chat interface if connected, otherwise render input fields and button
    return (
        <div>
            <ParentNavBar user={user} />
            <div className="chat-room">
                <div className="chat-container">
                    {!isConnected ? (
                        <div className="connect-form">
                            <h1>Join A Room:</h1>
                            <input
                                className="name-input"
                                placeholder="Your Name..."
                                value={senderName}
                                onChange={(event) => {
                                    setSenderName(event.target.value);
                                }}
                            />
                            <input
                                className="room-input"
                                placeholder="e.g., 1 or 2"
                                value={room}
                                onChange={(event) => {
                                    setRoom(event.target.value);
                                }}
                            />
                            <button className="connect-button" onClick={joinRoom}>Connect</button>
                        </div>
                    ) : (
                        <>
                            <div className="notification">{notification}</div>
                            <div className="message-container">
                                <h1>OLLI Message:</h1>
                                {/* Render the received messages */}
                                {messagesReceived.map((msg, index) => (
                                    <div className={`message ${msg.senderName === senderName ? 'own-message' : ''}`} key={index}>
                                        <span className="sender">{msg.senderName}:</span> {msg.message}
                                    </div>
                                ))}
                            </div>

                            <div className="chat-inputs">
                                <input
                                    className="message-input"
                                    placeholder="Message..."
                                    value={message}
                                    onChange={(event) => {
                                        setMessage(event.target.value);
                                    }}
                                />
                                <button className="send-button" onClick={sendMessage}>Send</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatRoom;
