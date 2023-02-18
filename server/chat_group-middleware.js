const socketio = require("socket.io");
const pubsub = require("pubsub-js");

function createChatGroupMiddleware(server) {
  const io = socketio(server);

  io.on("connection", (socket) => {
    let username = null;

    // Listen for a 'join' event to add the user to the chat group
    socket.on("join", (data) => {
      console.log("join", data);
      username = data.username;
      socket.join("chat-group");
      pubsub.publish("chat-message", {
        username: username,
        message: "has joined the chat",
      });
    });

    // Listen for a 'leave' event to remove the user from the chat group
    socket.on("leave", () => {
      socket.leave("chat-group");
      pubsub.publish("chat-message", {
        username: username,
        message: "has left the chat",
      });
    });

    // Listen for a 'chat-message' event to broadcast the message to all connected users
    socket.on("chat-message", (data) => {
      console.log("chat-message", data);
      pubsub.publish("chat-message", {
        username: username,
        message: data.message,
      });
    });
  });

  // Subscribe to the 'chat-message' event to broadcast the message to all connected users
  pubsub.subscribe("chat-message", (msg, data) => {
    io.to("chat-group").emit("chat-message", data);
  });

  return function chatGroupMiddleware(req, res, next) {
    next();
  };
}

module.exports = createChatGroupMiddleware;
