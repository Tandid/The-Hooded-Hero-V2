const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("clientConnected", () => {
        console.log(`Client ${socket.id} confirmed connection`);
    });

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

