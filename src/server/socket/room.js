class Room {
    constructor() {
        this.isOpen = true;

        this.players = {};
        this.numPlayers = 0;
        this.playersLoaded = 0;

        this.countdown = 1;
        this.stageTimer = 3;

        this.stage = "stage1";
        this.stageWinners = [];
        this.numWinners = 0;
    }

    addNewPlayer(socketId, spriteKey, username) {
        this.players[socketId] = { spriteKey, username };
        this.numPlayers += 1;
    }

    removePlayer(socketId) {
        if (this.players[socketId]) {
            delete this.players[socketId];
            this.numPlayers -= 1;
        }
    }

    // updatePlayerList() {
    //     // update player list based on winner list for next stage
    //     Object.keys(this.players).forEach((playerId) => {
    //         if (!this.stageWinners.includes(playerId)) {
    //             this.removePlayer(playerId);
    //         }
    //     });
    // }

    runCountdownTimer() {
        if (this.countdown > 0) {
            this.countdown -= 1;
        }
    }

    openRoom() {
        this.isOpen = true;
        this.countdown = 5;
        this.resetStageTimer();
        this.resetAllStageStatus();
    }

    closeRoom() {
        this.isOpen = false;
    }

    runStageTimer() {
        this.stageTimer -= 1;
    }

    resetStageTimer() {
        this.stageTimer = 5;
    }

    updateLoadedPlayerNum() {
        this.playersLoaded += 1;
    }

    updateWinnerList(socketId, username) {
        // only add player as winner if they haven't been added yet
        if (!this.stageWinners.includes(socketId)) {
            this.stageWinners.push(socketId);
            this.numWinners = this.stageWinners.length;
        }
    }

    removeWinner(socketId) {
        const index = this.stageWinners.indexOf(socketId);
        if (index > -1) {
            this.stageWinners.splice(index, 1);
            this.numWinners = this.stageWinners.length;
        }
    }

    reachStageLimit(num) {
        return this.numWinners >= num;
    }

    resetStageStatus() {
        this.resetStageTimer();
        this.playersLoaded = 0;
    }

    resetWinnerList() {
        this.numWinners = 0;
        this.stageWinners = [];
    }

    resetAllStageStatus() {
        this.playersLoaded = 0;
        this.stageWinners = [];
        this.numWinners = 0;
    }
}

const gameRooms = {};

const staticRooms = [];

const numStaticRooms = 5;

for (let i = 1; i <= numStaticRooms; ++i) {
    gameRooms[`room${i}`] = new Room();
    staticRooms.push(gameRooms[`room${i}`]);
}

module.exports = { Room, gameRooms, staticRooms };

