import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Connect to the socket.io server
    const socket = io("http://localhost:8000");
    setSocket(socket);

    // Prompt the user for a username when they connect to the chat group
    let username = prompt("Please enter your username:");
    setUsername(username);

    // Send a 'join' event to the server to join the chat group
    socket.emit("join", { username });

    // Listen for 'chat-message' events from the server and add the message to the messages state
    socket.on("chat-message", (message) => {
      console.log("chat-message", message);
      setMessages((messages) => [...messages, message]);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      // Send a 'leave' event to the server and disconnect from the chat group
      socket.emit("leave");
      socket.disconnect();
    };
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Send a 'chat-message' event to the server with the message text
    socket.emit("chat-message", { message: inputValue });

    // Clear the input field
    setInputValue("");
  };

  return (
    <div>
      <h1>Chat Group</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            {message.username}: {message.message}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
