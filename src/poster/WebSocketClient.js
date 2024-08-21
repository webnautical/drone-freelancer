// WebSocketClient.js
import React, { useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const WebSocketClient = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socketUrl = 'ws://localhost:5000'; // Adjust the URL to your WebSocket server

  const { sendJsonMessage, readyState } = useWebSocket(socketUrl, {
    onMessage: (event) => {
      const newMessage = JSON.parse(event.data);
      console.log(newMessage,"newMessage")
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    },
  });

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      sendJsonMessage({ type: 'chat', content: message });
      setMessage('');
    }
  };
console.log(messages,"messages")
  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.content}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
      <div>
        WebSocket Status: {ReadyState[readyState]}
      </div>
    </div>
  );
};

export default WebSocketClient;
