class Room {
    constructor() {
        this.players = {};
        this.playerNum = 0;
        this.countdown = 5;
        this.stageTimer = 5;
        this.isOpen = true;
        this.stage = "stage1";
        this.playersLoaded = 0;
        this.stageWinners = [];
        this.winnerNum = 0;
    }

    addNewPlayer(socketId, spriteKey, username) {
        this.players[socketId] = { spriteKey, username };
        this.playerNum += 1;
    }

    removePlayer(socketId) {
        if (this.players[socketId]) {
            delete this.players[socketId];
            this.playerNum -= 1;
        }
    }

    updatePlayerList() {
        // update player list based on winner list for next stage
        Object.keys(this.players).forEach((playerId) => {
            if (!this.stageWinners.includes(playerId)) {
                this.removePlayer(playerId);
            }
        });
    }

    runTimer() {
        if (this.countdown > 0) {
            this.countdown -= 1;
        }
    }

    resetTimer() {
        this.countdown = 5;
    }

    runStageTimer() {
        this.stageTimer -= 1;
    }

    resetStageTimer() {
        this.stageTimer = 5;
    }

    closeRoom() {
        this.isOpen = false;
    }

    openRoom() {
        this.isOpen = true;
        this.resetTimer();
        this.resetStageTimer();
        this.resetAllStageStatus();
    }

    checkRoomStatus() {
        return this.isOpen;
    }

    updateLoadedPlayerNum() {
        this.playersLoaded += 1;
    }

    updateWinnerList(socketId) {
        // only add player as winner if they haven't been added yet
        if (!this.stageWinners.includes(socketId)) {
            this.stageWinners.push(socketId);
            this.winnerNum = this.stageWinners.length;
        }
    }

    removeWinner(socketId) {
        const index = this.stageWinners.indexOf(socketId);
        if (index > -1) {
            this.stageWinners.splice(index, 1);
            this.winnerNum = this.stageWinners.length;
        }
    }

    reachStageLimit(stageKey) {
        return this.winnerNum >= this.stageLimits[stageKey];
    }

    resetStageStatus() {
        this.resetStageTimer();
        this.playersLoaded = 0;
    }

    resetWinnerList() {
        this.winnerNum = 0;
        this.stageWinners = [];
    }

    resetAllStageStatus() {
        this.playersLoaded = 0;
        this.stageWinners = [];
        this.winnerNum = 0;
    }
}

const gameRooms = {};
const staticRooms = [];
const totalRoomNum = 5;
for (let i = 1; i <= totalRoomNum; ++i) {
    gameRooms[`room${i}`] = new Room();
    staticRooms.push(gameRooms[`room${i}`]);
}

module.exports = { Room, gameRooms, staticRooms };

