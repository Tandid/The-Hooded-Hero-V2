const { Room, gameRooms, staticRooms } = require("./room");

// Handle a new connection
const handleConnection = (socket, io) => {
    console.log(`${socket.id} connected`);

    // Send back current static rooms status
    socket.on("createStaticRooms", () => {
        socket.emit("staticRoomsCreated", staticRooms);
    });

    // Handle creation of new room, generate a random key
    socket.on("createNewRoom", () => {
        let code;
        do {
            code = roomCodeGenerator();
        } while (gameRooms[code]);

        gameRooms[code] = new Room();
        socket.emit("newRoomCreated", code);
    });

    // Handle room joining
    socket.on("joinRoom", (data) => handleJoinRoom(socket, io, data));

    // Handle player leaving the game
    socket.on("leaveGame", () => handleLeaveGame(socket, io));

    // Handle socket disconnection
    socket.on("disconnecting", () => handleDisconnecting(socket, io));
};

// Handle a player joining a room
const handleJoinRoom = (socket, io, { roomKey, spriteKey, username }) => {
    const currentRoom = gameRooms[roomKey];

    if (currentRoom && currentRoom.isOpen && currentRoom.numPlayers <= 4) {
        socket.join(roomKey);
        currentRoom.addNewPlayer(socket.id, spriteKey, username);

        // Send all info of that room to player
        socket.emit("roomReady", { currentRoom, roomKey });

        // Send player info to other players in that room
        socket.to(roomKey).emit("newPlayerJoined", {
            playerId: socket.id,
            playerInfo: currentRoom.players[socket.id],
        });

        // Set up event listeners for game actions
        setupGameListeners(socket, io, currentRoom, roomKey);
    } else {
        socket.emit(
            currentRoom
                ? currentRoom.numPlayers >= 4
                    ? "roomFull"
                    : "roomClosed"
                : "roomDoesNotExist"
        );
    }
};

// Set up event listeners for game actions
const setupGameListeners = (socket, io, currentRoom, roomKey) => {
    socket.on("startCountdown", () => startCountdown(io, currentRoom, roomKey));
    socket.on("updatePlayer", (moveState) => {
        socket
            .to(roomKey)
            .emit("playerMoved", { playerId: socket.id, moveState });
    });

    socket.on("stageLoaded", () => stageLoaded(io, currentRoom, roomKey));
    socket.on("passStage", (stageKey) =>
        passStage(io, currentRoom, roomKey, stageKey)
    );
};

// Handle starting the timer
const startCountdown = (io, currentRoom, roomKey) => {
    const countdownInterval = setInterval(() => {
        if (currentRoom.countdown > 0) {
            io.in(roomKey).emit("updateCountdown", currentRoom.countdown);
            currentRoom.runCountdownTimer();
        } else {
            clearInterval(countdownInterval);
            currentRoom.closeRoom();
            io.emit("updateRooms", staticRooms);
            io.in(roomKey).emit("loadLevel", currentRoom);
        }
    }, 1000);
};

// Handle stage loaded
const stageLoaded = (io, currentRoom, roomKey) => {
    currentRoom.updateLoadedPlayerNum();

    if (currentRoom.numPlayers === currentRoom.playersLoaded) {
        const stageInterval = setInterval(() => {
            if (currentRoom.stageTimer > 0) {
                io.in(roomKey).emit(
                    "stageTimerUpdated",
                    currentRoom.stageTimer
                );
                currentRoom.runStageTimer();
            } else {
                clearInterval(stageInterval);
                io.in(roomKey).emit("startStage");
            }
        }, 1000);
    }
};

// Handle passing a stage
const passStage = (io, currentRoom, roomKey, stageKey) => {
    if (!currentRoom.reachStageLimit(2)) {
        currentRoom.updateWinnerList(socket.id);
        io.in(roomKey).emit("updateWinners", currentRoom.winnerNum);
    }

    if (currentRoom.reachStageLimit(2)) {
        currentRoom.resetStageStatus();
        // currentRoom.updatePlayerList();
        io.in(roomKey).emit("stageEnded", currentRoom);
        currentRoom.resetWinnerList();
    }
};

// Handle a player leaving the game
const handleLeaveGame = (socket, io) => {
    const roomKey = Object.keys(socket.rooms).find(
        (room) => room !== socket.id
    );
    if (!roomKey) return;

    const currentRoom = gameRooms[roomKey];
    stopAllListeners(socket);
    socket.leave(roomKey);
    currentRoom.removePlayer(socket.id);

    if (currentRoom.numPlayers === 0) {
        delete gameRooms[roomKey];
        currentRoom.openRoom();
        io.emit("updateRooms", staticRooms);
    } else {
        socket.to(roomKey).emit("playerLeft", { playerId: socket.id });
        socket.emit("gameLeft");
    }
};

// Handle a player disconnecting
const handleDisconnecting = (socket, io) => {
    const roomKey = Object.keys(socket.rooms).find(
        (room) => room !== socket.id
    );
    if (!roomKey) return;

    const currentRoom = gameRooms[roomKey];
    currentRoom.removePlayer(socket.id);

    if (currentRoom.numPlayers === 0) {
        delete gameRooms[roomKey];
        currentRoom.openRoom();
        io.emit("updateRooms", staticRooms);
    } else {
        if (currentRoom.playersLoaded > 0) currentRoom.playersLoaded -= 1;
        currentRoom.countStageLimits();
        currentRoom.removeWinner(socket.id);
        socket.to(roomKey).emit("playerLeft", {
            playerId: socket.id,
            newStageLimits: currentRoom.stageLimits,
            winnerNum: currentRoom.winnerNum,
        });

        if (
            currentRoom.reachStageLimit(
                currentRoom.stages[currentRoom.stageIdx]
            )
        ) {
            currentRoom.resetStageStatus();
            currentRoom.updatePlayerList();
            io.in(roomKey).emit("stageEnded", currentRoom);
            currentRoom.resetWinnerList();
        }
    }
};

// Stop all listeners for a socket
const stopAllListeners = (socket) => {
    const events = [
        "startCountdown",
        "stageLoaded",
        "updatePlayer",
        "passStage",
        "leaveGame",
        "disconnecting",
    ];
    events.forEach((event) => socket.removeAllListeners(event));
};

// Code generator for custom room
const roomCodeGenerator = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";
    return Array.from({ length: 4 }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
};

// Define socket functionality on server side
module.exports = (io) => {
    io.on("connection", (socket) => handleConnection(socket, io));
};

