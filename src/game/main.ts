import Phaser from "phaser"; // This needs to be in the top level for RexUI to work properly

// TODO: Add Phase.d.ts to assist with type checking for TextEditPlugin
// REX UI Plugin Imports
import BBCodeTextPlugin from "phaser3-rex-plugins/plugins/bbcodetext-plugin";
import InputTextPlugin from "phaser3-rex-plugins/plugins/inputtext-plugin";
// import TextEditPlugin from "phaser3-rex-plugins/plugins/textedit-plugin.js";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";

// Scene Imports
import Boot from "./scenes/Boot";
import MainMenu from "./scenes/MainMenu";
import Preloader from "./scenes/Preloader";
import SettingsOverlay from "./scenes/SettingsOverlay";
import Signup from "./scenes/Signup";
import CharSelection from "./scenes/multiplayer/CharSelection";
import LobbyScene from "./scenes/multiplayer/Lobby";

// Custom configurations
const MAP_WIDTH = 16000;

const WIDTH = 1280;
const HEIGHT = 720;
const ZOOM_FACTOR = 0.5;

const SHARED_CONFIG = {
    mapOffset: MAP_WIDTH > WIDTH ? MAP_WIDTH - WIDTH : 0,
    width: WIDTH,
    height: HEIGHT,
    zoomFactor: ZOOM_FACTOR,
    debug: true,
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

const Scenes = [
    Boot,
    Preloader,
    MainMenu,
    CharSelection,
    LobbyScene,
    Signup,
    SettingsOverlay,
];

const createScene = (Scene: any) => new Scene(SHARED_CONFIG);
const initScenes = () => Scenes.map(createScene);

// Main Configuration
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
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
    plugins: {
        scene: [
            {
                key: "rexUI",
                plugin: UIPlugin,
                mapping: "rexUI",
            },
        ],
        global: [
            {
                key: "rexInputTextPlugin",
                plugin: InputTextPlugin,
                start: true,
            },
            {
                key: "rexBBCodeTextPlugin",
                plugin: BBCodeTextPlugin,
                start: true,
            },
            // {
            //     key: "rexTextEdit",
            //     plugin: TextEditPlugin,
            //     start: true,
            // },
        ],
    },
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: initScenes(),
};

const StartGame = (parent: string) => {
    return new Phaser.Game({ parent, ...config });
};

export default StartGame;

