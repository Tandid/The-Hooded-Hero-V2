// AUDIO
export function preloadAudio(scene: Phaser.Scene) {
    // THEME MUSIC
    scene.load.audio("menu-theme", "music/menu_music.wav");
    scene.load.audio("forest-theme", "music/forest_theme.wav");
    scene.load.audio("cave-theme", "music/cave_theme.wav");
    scene.load.audio("boss-theme", "music/boss_theme.wav");
    scene.load.audio("online-theme", "music/online_theme.wav");
    scene.load.audio("sakura-theme", "music/sakura_theme.wav");

    // SOUND EFFECTS
    scene.load.audio("projectile-launch", "music/projectile_launch.wav");
    scene.load.audio("step", "music/step_mud.wav");
    scene.load.audio("jump", "music/jump.wav");
    scene.load.audio("swipe", "music/swipe.wav");
    scene.load.audio("damage", "music/punch.wav");
    scene.load.audio("enemy-damage", "music/enemyhit.wav");
    scene.load.audio("coin-pickup", "music/coin_pickup.wav");
    scene.load.audio("cursorOver", "music/cursorOver.wav");
    scene.load.audio("flute", "music/flute.wav");
    scene.load.audio("page-flip", "music/page_flip.wav");
    scene.load.audio("select", "music/select.wav");
    scene.load.audio("lose", "music/lose.wav");
    scene.load.audio("win", "music/win.wav");
    scene.load.audio("fail", "music/fail.wav");
    scene.load.audio("countdown", "music/countdown.wav");
    scene.load.audio("go", "music/go.wav");
}

