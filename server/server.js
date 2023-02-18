const express = require("express");
require("dotenv").config();
const createChatGroupMiddleware = require("./chat_group-middleware");

const app = express();
const server = require("http").createServer(app);
const port = process.env.PORT || 9000;

const chatGroupMiddleware = createChatGroupMiddleware(server);
app.use(chatGroupMiddleware);

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
