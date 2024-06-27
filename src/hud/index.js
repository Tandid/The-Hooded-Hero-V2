import Phaser from "phaser";

class Hud extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);

        scene.add.existing(this);

        const { rightTopCorner, leftTopCorner } = scene.config;

        this.containerWidth = 100;
        this.setPosition(
            rightTopCorner.x - this.containerWidth,
            rightTopCorner.y + 10
        );

        this.setScrollFactor(0);
        this.fontSize = 50;

        this.createPlayerIcon(leftTopCorner);
        this.setupList();
    }

    createPlayerIcon(leftTopCorner) {
        const portrait = this.scene.add
            .image(leftTopCorner.x + 100, leftTopCorner.y + 100, "portrait")
            .setOrigin(0.5)
            .setScale(1);

        const playerImage = this.scene.add
            .image(leftTopCorner.x + 100, leftTopCorner.y + 100, "player-icon")
            .setOrigin(0.5)
            .setScale(1.1);

        const playerIcon = this.scene.add.container(0, 0, [
            portrait,
            playerImage,
        ]);

        playerIcon.setDepth(2).setScrollFactor(0);
        return playerIcon;
    }

    setupList() {
        const scoreBoard = this.createScoreboard();
        this.add([scoreBoard]);

        let lineHeight = 0;
        this.list.forEach((item) => {
            item.setPosition(item.x, item.y + lineHeight);
            lineHeight += 20;
        });
        console.log(this.list);
    }

    createScoreboard() {
        const scoreImage = this.scene.add
            .image(40, 5, "coin")
            .setOrigin(1.5, 0)
            .setScale(1);

        const scoreText = this.scene.add.text(15, 20, "0", {
            fontSize: `${this.fontSize}px`,
            fill: "#fff",
        });

        const scoreBoard = this.scene.add.container(0, 0, [
            scoreImage,
            scoreText,
        ]);
        scoreBoard.setName("scoreBoard");
        return scoreBoard;
    }

    updateScoreboard(score) {
        const [scoreImage, scoreText] = this.getByName("scoreBoard").list;
        scoreText.setText(score);
    }
}

export default Hud;

