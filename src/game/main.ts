// @ts-nocheck
import Phaser from "phaser"; // This needs to be in the top level for RexUI to work properly

// TODO: Add Phase.d.ts to assist with type checking for TextEditPlugin
// REX UI Plugin Imports
import BBCodeTextPlugin from "phaser3-rex-plugins/plugins/bbcodetext-plugin";
import InputTextPlugin from "phaser3-rex-plugins/plugins/inputtext-plugin";
import TextEditPlugin from "phaser3-rex-plugins/plugins/textedit-plugin.js";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";

// Initial Scenes
import Boot from "./scenes/Boot";
import MainMenu from "./scenes/MainMenu";
import Preloader from "./scenes/Preloader";
import SignupScene from "./scenes/Signup";

// Story Mode Scenes
import LevelSelect from "./scenes/LevelSelect";
import PlayScene from "./scenes/Play";

// Multiplayer Scenes
import HeroSelectScene from "./scenes/multiplayer/HeroSelect";
import JoinCustomRoomScene from "./scenes/multiplayer/JoinRoom";
import OnlinePlayScene from "./scenes/multiplayer/OnlinePlay";
import RankingScene from "./scenes/multiplayer/Rankings";
import RoomSelectScene from "./scenes/multiplayer/RoomSelect";
import WaitingScene from "./scenes/multiplayer/WaitingScene";

// Secondary Scenes
import Contact from "./scenes/secondary/Contact";
import Controls from "./scenes/secondary/Controls";
import CreditsScene from "./scenes/secondary/Credits";
import GameOverScene from "./scenes/secondary/GameOver";
import Loading from "./scenes/secondary/Loading";
import PauseScene from "./scenes/secondary/Pause";
import SettingsScene from "./scenes/secondary/Settings";
import VictoryScene from "./scenes/secondary/Victory";

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
    SignupScene,
    MainMenu,
    HeroSelectScene,
    RoomSelectScene,
    SettingsScene,
    JoinCustomRoomScene,
    Contact,
    Controls,
    CreditsScene,
    LevelSelect,
    Loading,
    GameOverScene,
    VictoryScene,
    PauseScene,
    PlayScene,
    WaitingScene,
    OnlinePlayScene,
    RankingScene,
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
            debug: false,
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
            {
                key: "rexTextEdit",
                plugin: TextEditPlugin,
                start: true,
            },
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

