const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const setupSockets = require("./socket/index");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
    },
});

setupSockets(io);

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

