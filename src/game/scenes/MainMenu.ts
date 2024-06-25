import { GameObjects, Scene } from "phaser";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    config: any;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    start: number;
    fontFamily: string;

    constructor() {
        super("MainMenu");
        this.config = {
            width: 1280,
            height: 720,
        };
        this.fontFamily = "customFont";
        this.start = this.config.width / 10;
    }

    init() {
        this.cameras.main.fadeIn(500, 0, 0, 0);
        // this.cursorOver = this.sound.add("cursorOver");
        // this.cursorOver.volume = 0.4;

        // this.select = this.sound.add("select");
        // this.select.volume = 0.4;

        // this.pageFlip = this.sound.add("page-flip");
        // this.pageFlip.volume = 0.4;

        // this.flute = this.sound.add("flute");
        // this.flute.volume = 0.4;

        this.add
            .image(this.config.width / 2, this.config.height / 2, "panel-1")
            .setOrigin(0.5)
            .setScale(0.8);
        this.add
            .image(this.config.width / 2, this.config.height / 2, "logo")
            .setOrigin(0.5)
            .setScale(0.6);

        this.add
            .image(this.config.width / 8, this.config.height - 30, "textbox")
            .setOrigin(0.5)
            .setScale(1, 0.5)
            .setDepth(1);

        this.add
            .image(this.config.width / 25, this.config.height - 30, "profile")
            .setOrigin(0.5)
            .setScale(0.5)
            .setDepth(2);
    }

    // create() {
    //     super.create();

    //     this.add
    //       .text(
    //         this.config.width / 10 - 10,
    //         this.config.height - 45,
    //         `${this.username}`,
    //         {
    //           fontFamily: "customFont",
    //           fontSize: "30px",
    //           fontWeight: "larger",
    //         }
    //       )
    //       .setOrigin(0)
    //       .setColor("#000")
    //       .setDepth(2);

    //     this.createControlsButton();
    //     this.createContactsButton();
    //     this.createSettingsButton();
    //     this.createMenu(this.menu, this.setupMenuEvents.bind(this));
    //     this.playBgMusic();
    //   }
}

