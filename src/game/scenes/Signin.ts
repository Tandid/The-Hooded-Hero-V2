import UsernameConfig from "../utils/UsernameSceneConfig";

class UsernameScene extends Phaser.Scene {
    constructor(config) {
        super("UsernameScene");
        this.config = config;
        this.state = {
            titleText: "Enter your name!",
        };
    }

    init(data) {
        this.socket = data.socket;
        console.log({ UsernameScene: data });
    }

    create() {
        const usernameConfig = new UsernameConfig(this, this.socket);
        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.cursorOver = this.sound.add("cursorOver");
        this.cursorOver.volume = 0.4;

        // this.select = this.sound.add("select");
        this.select.volume = 0.4;

        this.pageFlip = this.sound.add("page-flip");
        this.pageFlip.volume = 0.4;

        this.flute = this.sound.add("flute");
        this.flute.volume = 0.4;

        this.add
            .image(this.config.width / 2, this.config.height / 2, "panel-2")
            .setOrigin(0.5)
            .setScale(0.6);

        this.add
            .text(
                this.config.width / 2,
                this.config.height / 3,
                `${this.state.titleText}`,
                {
                    fontFamily: "customFont",
                    fontSize: "60px",
                    fontWeight: "larger",
                }
            )
            .setOrigin(0.5, 0.5)
            .setColor("#000");

        usernameConfig.runAllTextBoxLogic(
            this.config.width / 2,
            this.config.height / 2,
            {
                fontFamily: "customFont",
                textColor: 0xffffff,
                fontSize: "20px",
                fixedWidth: 500,
                fixedHeight: 60,
            }
        );
    }
}

export default UsernameScene;
