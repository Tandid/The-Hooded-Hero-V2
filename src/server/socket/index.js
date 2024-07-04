import { Room, gameRooms, staticRooms } from "./room";

// Code generator for custom room
const roomCodeGenerator = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";
    return Array.from({ length: 4 }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
};

// Handle a new connection
const handleConnection = (socket, io) => {
    console.log("Socket is connected");

    // Send back current static rooms status
    socket.on("checkStaticRooms", () => {
        console.log("Backend: Check StaticRooms");
        socket.emit("staticRoomStatus", staticRooms);
    });

    // Handle room creation
    socket.on("createRoom", () => {
        let code;
        do {
            code = roomCodeGenerator();
        } while (gameRooms[code]);

        gameRooms[code] = new Room();
        socket.emit("roomCreated", code);
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
    const roomInfo = gameRooms[roomKey];

    if (roomInfo && roomInfo.checkRoomStatus() && roomInfo.playerNum < 16) {
        socket.join(roomKey);
        roomInfo.addNewPlayer(socket.id, spriteKey, username);

        // Send all info of that room to player
        socket.emit("roomInfo", { roomInfo, roomKey });

        // Send player info to other players in that room
        socket.to(roomKey).emit("newPlayerJoined", {
            playerId: socket.id,
            playerInfo: roomInfo.players[socket.id],
        });

        // Set up event listeners for game actions
        setupGameListeners(socket, io, roomInfo, roomKey);
    } else {
        socket.emit(
            roomInfo
                ? roomInfo.playerNum >= 16
                    ? "roomFull"
                    : "roomClosed"
                : "roomDoesNotExist"
        );
    }
};

// Set up event listeners for game actions
const setupGameListeners = (socket, io, roomInfo, roomKey) => {
    socket.on("startTimer", () => startTimer(io, roomInfo, roomKey));
    socket.on("stageLoaded", () => stageLoaded(io, roomInfo, roomKey));
    socket.on("updatePlayer", (moveState) => {
        socket
            .to(roomKey)
            .emit("playerMoved", { playerId: socket.id, moveState });
    });
    socket.on("passStage", (stageKey) =>
        passStage(io, roomInfo, roomKey, stageKey)
    );
    socket.on("randomize", () => roomInfo.randomizeStages());
};

// Handle starting the timer
const startTimer = (io, roomInfo, roomKey) => {
    const countdownInterval = setInterval(() => {
        if (roomInfo.countdown > 0) {
            io.in(roomKey).emit("timerUpdated", roomInfo.countdown);
            roomInfo.runTimer();
        } else {
            clearInterval(countdownInterval);
            roomInfo.closeRoom();
            io.emit("updatedRooms", staticRooms);
            io.in(roomKey).emit("loadNextStage", roomInfo);
        }
    }, 1000);
};

// Handle stage loaded
const stageLoaded = (io, roomInfo, roomKey) => {
    roomInfo.updateLoadedPlayerNum();

    if (roomInfo.playerNum === roomInfo.playersLoaded) {
        const stageInterval = setInterval(() => {
            if (roomInfo.stageTimer > 0) {
                io.in(roomKey).emit("stageTimerUpdated", roomInfo.stageTimer);
                roomInfo.runStageTimer();
            } else {
                clearInterval(stageInterval);
                io.in(roomKey).emit("startStage");
            }
        }, 1000);
    }
};

// Handle passing a stage
const passStage = (io, roomInfo, roomKey, stageKey) => {
    if (!roomInfo.reachStageLimit(stageKey)) {
        roomInfo.updateWinnerList(socket.id);
        io.in(roomKey).emit("updateWinners", roomInfo.winnerNum);
    }

    if (roomInfo.reachStageLimit(stageKey)) {
        roomInfo.resetStageStatus();
        roomInfo.updatePlayerList();
        io.in(roomKey).emit("stageEnded", roomInfo);
        roomInfo.resetWinnerList();
    }
};

// Handle a player leaving the game
const handleLeaveGame = (socket, io) => {
    const roomKey = Object.keys(socket.rooms).find(
        (room) => room !== socket.id
    );
    if (!roomKey) return;

    const roomInfo = gameRooms[roomKey];
    stopAllListeners(socket);
    socket.leave(roomKey);
    roomInfo.removePlayer(socket.id);

    if (roomInfo.playerNum === 0) {
        delete gameRooms[roomKey];
        roomInfo.openRoom();
        io.emit("updatedRooms", staticRooms);
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

    const roomInfo = gameRooms[roomKey];
    roomInfo.removePlayer(socket.id);

    if (roomInfo.playerNum === 0) {
        delete gameRooms[roomKey];
        roomInfo.openRoom();
        io.emit("updatedRooms", staticRooms);
    } else {
        if (roomInfo.playersLoaded > 0) roomInfo.playersLoaded -= 1;
        roomInfo.countStageLimits();
        roomInfo.removeWinner(socket.id);
        socket.to(roomKey).emit("playerLeft", {
            playerId: socket.id,
            newStageLimits: roomInfo.stageLimits,
            winnerNum: roomInfo.winnerNum,
        });

        if (roomInfo.reachStageLimit(roomInfo.stages[roomInfo.stageIdx])) {
            roomInfo.resetStageStatus();
            roomInfo.updatePlayerList();
            io.in(roomKey).emit("stageEnded", roomInfo);
            roomInfo.resetWinnerList();
        }
    }
};

// Stop all listeners for a socket
const stopAllListeners = (socket) => {
    const events = [
        "startTimer",
        "stageLoaded",
        "updatePlayer",
        "passStage",
        "randomize",
        "leaveGame",
        "disconnecting",
    ];
    events.forEach((event) => socket.removeAllListeners(event));
};

// Define socket functionality on server side
export default (io) => {
    io.on("connection", (socket) => handleConnection(socket, io));
};

