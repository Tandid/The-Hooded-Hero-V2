export function preloadSpriteSheets(scene: Phaser.Scene) {
    // ------------------- PLAYER MOVEMENT --------------------------------

    scene.load.spritesheet("player", "player/move_sprite_1.png", {
        frameWidth: 300,
        frameHeight: 190,
        // spacing: 50,
    });

    scene.load.spritesheet(
        "player-shoot-arrow",
        "player/throw_attack_sheet_1.png",
        {
            frameWidth: 300,
            frameHeight: 190,
            // spacing: 32,
        }
    );

    scene.load.spritesheet("player-melee", "player/attackspritesheet.png", {
        frameWidth: 300,
        frameHeight: 190,
        // spacing: 32,
    });

    scene.load.spritesheet("hit-sheet", "weapons/hit_effect_sheet.png", {
        frameWidth: 226,
        frameHeight: 272,
    });

    scene.load.spritesheet("sword-default", "weapons/sword_hitbox.png", {
        frameWidth: 300,
        frameHeight: 190,
        // spacing: 32,
    });

    // ----------- ONLINE PLAYER MOVEMENT --------------------------------

    scene.load.spritesheet("player-1", "player/player_1.png", {
        frameWidth: 300,
        frameHeight: 200,
        // spacing: 32,
    });
    scene.load.spritesheet("player-2", "player/player_2.png", {
        frameWidth: 160,
        frameHeight: 180,
        // spacing: 32,
    });
    scene.load.spritesheet("player-3", "player/player_3.png", {
        frameWidth: 300,
        frameHeight: 200,
    });
    scene.load.spritesheet("player-4", "player/player_4.png", {
        frameWidth: 170,
        frameHeight: 180,
        // spacing: 32,
    });

    // ------------ ENEMIES ------------------------------------------------

    scene.load.spritesheet("skeleton", "enemy/skeleton.png", {
        frameWidth: 290,
        frameHeight: 170,
        // spacing: 32,
    });

    scene.load.spritesheet("archer", "enemy/archer.png", {
        frameWidth: 233,
        frameHeight: 193,
        // spacing: 32,
    });
    scene.load.spritesheet("mage", "enemy/mage.png", {
        frameWidth: 300,
        frameHeight: 215,
        // spacing: 32,
    });

    scene.load.spritesheet("slime", "enemy/slime.png", {
        frameWidth: 258,
        frameHeight: 153,
        // spacing: 32,
    });

    scene.load.spritesheet("bee", "enemy/bee.png", {
        frameWidth: 170,
        frameHeight: 155,
        // spacing: 32,
    });

    scene.load.spritesheet("spider", "enemy/spider.png", {
        frameWidth: 184,
        frameHeight: 126,
        // spacing: 32,
    });

    scene.load.spritesheet("boss", "enemy/boss_run.png", {
        frameWidth: 850,
        frameHeight: 477,
        // spacing: 32,
    });
    scene.load.spritesheet("boss-default", "enemy/boss_attack.png", {
        frameWidth: 850,
        frameHeight: 477,
        // spacing: 32,
    });

    // scene.load.spritesheet(
    //   "boss-default",
    //   "enemy/boss_attack.png",
    //   {
    //     frameWidth: 850,
    //     frameHeight: 477,
    //     // spacing: 32,
    //   }
    // );

    // ------------------ DEATH ANIMATIONS --------------------------------

    scene.load.spritesheet("player-death", "deathAnims/player_death.png", {
        frameWidth: 300,
        frameHeight: 256,
        // spacing: 32,
    });

    scene.load.spritesheet("archer-death", "deathAnims/archer_death.png", {
        frameWidth: 453,
        frameHeight: 193,
        // spacing: 32,
    });
    scene.load.spritesheet("mage-death", "deathAnims/mage_death.png", {
        frameWidth: 510,
        frameHeight: 215,
        // spacing: 32,
    });

    scene.load.spritesheet("bee-death", "deathAnims/bee_death.png", {
        frameWidth: 370,
        frameHeight: 305,
        // spacing: 32,
    });

    scene.load.spritesheet("skeleton-death", "deathAnims/skeleton_death.png", {
        frameWidth: 460,
        frameHeight: 180,
        // spacing: 32,
    });

    scene.load.spritesheet("slime-death", "deathAnims/slime_death.png", {
        frameWidth: 258,
        frameHeight: 153,
        // spacing: 32,
    });

    scene.load.spritesheet("spider-death", "deathAnims/spider_death.png", {
        frameWidth: 294,
        frameHeight: 206,
        // spacing: 32,
    });

    scene.load.spritesheet("boss-death", "deathAnims/boss_death.png", {
        frameWidth: 850,
        frameHeight: 477,
        // spacing: 32,
    });
}

