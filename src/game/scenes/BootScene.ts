// import { Scene } from "phaser";

// export class BootScene extends Scene {
//     constructor(config) {
//         super("BootScene");
//         this.config = config;
//         this.fontFamily = "customFont";
//         this.start = this.config.width / 10;
//     }

//     // init(data) {
//     //     this.socket = data.socket;
//     //     console.log({ Loading: data });
//     // }

//     create() {
//         this.add
//             .image(this.config.width / 2, this.config.height / 2, "logo")
//             .setOrigin(0.5)
//             .setScale(0.6);

//         this.add
//             .text(
//                 this.config.width / 2,
//                 this.config.height / 2,
//                 `Loading Assets and Textures ...`,
//                 {
//                     fontFamily: "customFont",
//                     fontSize: "30px",
//                     fontWeight: "larger",
//                 }
//             )
//             .setOrigin(0.5, 0.5)
//             .setColor("#FFF");

//         this.add
//             .image(
//                 this.config.width / 1.1 + 50,
//                 this.config.height / 1.3,
//                 "dummy"
//             )
//             .setScale(1);

//         const x = this.start;
//         this.arrow = this.physics.add
//             .image(x, this.config.height / 1.6, "arrow")
//             .setScale(1.1)
//             .setDepth(2);

//         this.generateRandomHint();

//         setTimeout(() => {
//             this.scene.stop("BootScene");
//             this.scene.start("MainMenu");
//         }, 8000);
//     }

//     generateRandomHint() {
//         const messages = [
//             "Not all heroes wear capes, some wear hoods..",
//             "Hint: Yes, you can double jump!",
//             "The Hooded Hero's favorite show is Arrow, who would've guess right??",
//             "Hint: A little birdy said to stay away from Level 3, unless...",
//             "Hint: You can spam arrows!",
//             "Hint: Sword attacks do double the damage of arrows. You're welcome. ",
//         ];
//         const randomIndex = Math.floor(Math.random() * messages.length);

//         this.add
//             .text(
//                 this.config.width / 2,
//                 this.config.height / 1.1,
//                 `${messages[randomIndex]}`,
//                 {
//                     fontFamily: "customFont",
//                     fontSize: "15px",
//                     fontWeight: "larger",
//                 }
//             )
//             .setOrigin(0.5, 0.5)
//             .setColor("#FFF");
//     }

//     update() {
//         this.arrow.x += 3;
//         if (this.arrow.x > 1000) {
//             this.arrow.x = 1000;
//         }
//     }
// }

