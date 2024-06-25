export function preloadSpriteSheets(scene: Phaser.Scene) {
    // ------------------- PLAYER MOVEMENT --------------------------------

    scene.load.spritesheet("player", "public/assets/player/move_sprite_1.png", {
        frameWidth: 300,
        frameHeight: 190,
        // spacing: 50,
    });

    scene.load.spritesheet(
        "player-throw",
        "public/assets/player/throw_attack_sheet_1.png",
        {
            frameWidth: 300,
            frameHeight: 190,
            // spacing: 32,
        }
    );

    scene.load.spritesheet(
        "player-melee",
        "public/assets/player/attackspritesheet.png",
        {
            frameWidth: 300,
            frameHeight: 190,
            // spacing: 32,
        }
    );

    scene.load.spritesheet(
        "hit-sheet",
        "public/assets/weapons/hit_effect_sheet.png",
        {
            frameWidth: 226,
            frameHeight: 272,
        }
    );

    scene.load.spritesheet(
        "sword-default",
        "public/assets/weapons/sword_hitbox.png",
        {
            frameWidth: 300,
            frameHeight: 190,
            // spacing: 32,
        }
    );

    // ----------- ONLINE PLAYER MOVEMENT --------------------------------

    scene.load.spritesheet("player-1", "public/assets/player/player_1.png", {
        frameWidth: 300,
        frameHeight: 200,
        // spacing: 32,
    });
    scene.load.spritesheet("player-2", "public/assets/player/player_2.png", {
        frameWidth: 160,
        frameHeight: 180,
        // spacing: 32,
    });
    scene.load.spritesheet("player-3", "public/assets/player/player_3.png", {
        frameWidth: 300,
        frameHeight: 200,
    });
    scene.load.spritesheet("player-4", "public/assets/player/player_4.png", {
        frameWidth: 170,
        frameHeight: 180,
        // spacing: 32,
    });

    // ------------ ENEMIES ------------------------------------------------

    scene.load.spritesheet("skeleton", "public/assets/enemy/skeleton.png", {
        frameWidth: 290,
        frameHeight: 170,
        // spacing: 32,
    });

    scene.load.spritesheet("archer", "public/assets/enemy/archer.png", {
        frameWidth: 233,
        frameHeight: 193,
        // spacing: 32,
    });
    scene.load.spritesheet("mage", "public/assets/enemy/mage.png", {
        frameWidth: 300,
        frameHeight: 215,
        // spacing: 32,
    });

    scene.load.spritesheet("slime", "public/assets/enemy/slime.png", {
        frameWidth: 258,
        frameHeight: 153,
        // spacing: 32,
    });

    scene.load.spritesheet("bee", "public/assets/enemy/bee.png", {
        frameWidth: 170,
        frameHeight: 155,
        // spacing: 32,
    });

    scene.load.spritesheet("spider", "public/assets/enemy/spider.png", {
        frameWidth: 184,
        frameHeight: 126,
        // spacing: 32,
    });

    scene.load.spritesheet("boss", "public/assets/enemy/boss_run.png", {
        frameWidth: 850,
        frameHeight: 477,
        // spacing: 32,
    });
    scene.load.spritesheet(
        "boss-default",
        "public/assets/enemy/boss_attack.png",
        {
            frameWidth: 850,
            frameHeight: 477,
            // spacing: 32,
        }
    );

    // scene.load.spritesheet(
    //   "boss-default",
    //   "public/assets/enemy/boss_attack.png",
    //   {
    //     frameWidth: 850,
    //     frameHeight: 477,
    //     // spacing: 32,
    //   }
    // );

    // ------------------ DEATH ANIMATIONS --------------------------------

    scene.load.spritesheet(
        "player-death",
        "public/assets/deathAnims/player_death.png",
        {
            frameWidth: 300,
            frameHeight: 256,
            // spacing: 32,
        }
    );

    scene.load.spritesheet(
        "archer-death",
        "public/assets/deathAnims/archer_death.png",
        {
            frameWidth: 453,
            frameHeight: 193,
            // spacing: 32,
        }
    );
    scene.load.spritesheet(
        "mage-death",
        "public/assets/deathAnims/mage_death.png",
        {
            frameWidth: 510,
            frameHeight: 215,
            // spacing: 32,
        }
    );

    scene.load.spritesheet(
        "bee-death",
        "public/assets/deathAnims/bee_death.png",
        {
            frameWidth: 370,
            frameHeight: 305,
            // spacing: 32,
        }
    );

    scene.load.spritesheet(
        "skeleton-death",
        "public/assets/deathAnims/skeleton_death.png",
        {
            frameWidth: 460,
            frameHeight: 180,
            // spacing: 32,
        }
    );

    scene.load.spritesheet(
        "slime-death",
        "public/assets/deathAnims/slime_death.png",
        {
            frameWidth: 258,
            frameHeight: 153,
            // spacing: 32,
        }
    );

    scene.load.spritesheet(
        "spider-death",
        "public/assets/deathAnims/spider_death.png",
        {
            frameWidth: 294,
            frameHeight: 206,
            // spacing: 32,
        }
    );

    scene.load.spritesheet(
        "boss-death",
        "public/assets/deathAnims/boss_death.png",
        {
            frameWidth: 850,
            frameHeight: 477,
            // spacing: 32,
        }
    );
}

