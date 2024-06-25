import { AUTO, Game } from "phaser";
import { Boot } from "./scenes/Boot";
import { BootScene } from "./scenes/BootScene";
import { Game as MainGame } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";

const MAP_WIDTH = 16000;

const WIDTH = 1280;
const HEIGHT = 720;
const ZOOM_FACTOR = 0.5;

const SHARED_CONFIG = {
    mapOffset: MAP_WIDTH > WIDTH ? MAP_WIDTH - WIDTH : 0,
    width: WIDTH,
    height: HEIGHT,
    zoomFactor: ZOOM_FACTOR,
    debug: false,
    leftTopCorner: {
        x: (WIDTH - WIDTH / ZOOM_FACTOR) / 2,
        y: (HEIGHT - HEIGHT / ZOOM_FACTOR) / 2,
    },
    rightTopCorner: {
        x: WIDTH / ZOOM_FACTOR + (WIDTH - WIDTH / ZOOM_FACTOR) / 2,
        y: (HEIGHT - HEIGHT / ZOOM_FACTOR) / 2,
    },
    rightBottomCorner: {
        x: WIDTH / ZOOM_FACTOR + (WIDTH - WIDTH / ZOOM_FACTOR) / 2,
        y: HEIGHT / ZOOM_FACTOR + (HEIGHT - HEIGHT / ZOOM_FACTOR) / 2,
    },
    lastLevel: 3,
};

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    ...SHARED_CONFIG,
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
            overlapBias: 8,
            tileBias: 32,
            fps: 60,
            fixedStep: true,
        },
    },
    parent: "game-container",
    dom: {
        createContainer: true,
    },
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    // backgroundColor: "#000",
    scene: [Boot, BootScene, Preloader, MainMenu, MainGame, GameOver],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;

