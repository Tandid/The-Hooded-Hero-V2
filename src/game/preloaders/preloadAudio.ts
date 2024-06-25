// AUDIO
export function preloadAudio(scene: Phaser.Scene) {
    // THEME MUSIC
    scene.load.audio("menu-theme", "public/assets/music/menu_music.wav");
    scene.load.audio("forest-theme", "public/assets/music/forest_theme.wav");
    scene.load.audio("cave-theme", "public/assets/music/cave_theme.wav");
    scene.load.audio("boss-theme", "public/assets/music/boss_theme.wav");

    // SOUND EFFECTS
    scene.load.audio(
        "projectile-launch",
        "public/assets/music/projectile_launch.wav"
    );
    scene.load.audio("step", "public/assets/music/step_mud.wav");
    scene.load.audio("jump", "public/assets/music/jump.wav");
    scene.load.audio("swipe", "public/assets/music/swipe.wav");
    scene.load.audio("damage", "public/assets/music/punch.wav");
    scene.load.audio("enemy-damage", "public/assets/music/enemyhit.wav");
    scene.load.audio("coin-pickup", "public/assets/music/coin_pickup.wav");
    scene.load.audio("cursorOver", "public/assets/music/cursorOver.wav");
    scene.load.audio("flute", "public/assets/music/flute.wav");
    scene.load.audio("page-flip", "public/assets/music/page_flip.wav");
    scene.load.audio("select", "public/assets/music/select.wav");
    scene.load.audio("lose", "public/assets/music/lose.wav");
    scene.load.audio("win", "public/assets/music/win.wav");
}

