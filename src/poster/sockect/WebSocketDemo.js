import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export const WebSocketDemo = () => {
  // const [socketUrl, setSocketUrl] = useState('wss://echo.websocket.org');
  const [messageHistory, setMessageHistory] = useState([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket('wss://dronmatchmaker.itworkshop.in:5000');

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  // const handleClickChangeSocketUrl = useCallback(
  //   () => setSocketUrl('wss://demos.kaazing.com/echo'),
  //   []
  // );

  const handleClickSendMessage = useCallback(() => sendMessage('Hello'), []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];
  console.log(connectionStatus)
  console.log(messageHistory)
  return (
    <div>
      {/* <button onClick={handleClickChangeSocketUrl}>
        Click Me to change Socket Url
      </button> */}
      <button
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Click Me to send
      </button>
      {/* <span>The WebSocket is currently {connectionStatus}</span> */}
      {/* {lastMessage ? <span>Last message: {lastMessage.data}</span> : null} */}
      {/* <ul>
        {messageHistory.map((message, idx) => (
          <span key={idx}>{message ? message.data : null}</span>
        ))}
      </ul> */}
    </div>
  );
};