class FirstScene extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        /* Load Images */

        this.load.image('bg', './assets/images/background.png');
        this.load.image('logo', './assets/images/logo.png');
        this.load.image('moving-rectangle', './assets/images/frame.png');
        this.load.image('main-rectangle', './assets/images/rectangle.png');
        this.load.image('1', './assets/images/1.png');
        this.load.image('2', './assets/images/2.png');
        this.load.image('3', './assets/images/3.png');
        this.load.image('4', './assets/images/4.png');
        this.load.image('5', './assets/images/5.png');
        this.load.image('6', './assets/images/6.png');
        this.load.image('7', './assets/images/7.png');
        this.load.image('8', './assets/images/8.png');
        this.load.image('9', './assets/images/9.png');

        /* Load Sounds */

        this.load.audio('main', './assets/music/main.mp3')
        this.load.audio('error', './assets/music/Fail.mp3')

        /* Finish Objects */
        this.load.image('button', './assets/images/button.png');
        this.load.image('finishLogo', './assets/images/finishlogo.png');
    }
    create() {
        /* Loading Background and Logog*/
        const bg = this.add.image(0, 0, 'bg').setOrigin(0, 0).setInteractive().setName("bg");;
        const logo = this.add.image(540, 960, 'logo').setPosition(45, 0).setOrigin(0, 0).setScale(1.1);

        /* Text Logic*/
        const arrWithChangingStrings = ['six', 'nine', 'seven', 'four', 'two', 'eight', 'three', 'nine', 'six', 'four', 'two'];
        const arrWithChangingNumbers = [6, 9, 7, 4, 2, 8, 3, 9, 6, 4, 2];

        const text = this.add.text(108, 27, `Tap ${arrWithChangingNumbers[0]    }`, { fontFamily: 'CustomFont', fontSize: '72px', fontWeight: 'bold' }).setPosition(180, 360);

        /* Rectangle */

        const rectangle = this.add.image(0, 529, 'main-rectangle').setOrigin(0, 0).setInteractive().setName("rectangle");

        /* Load Numbers in Rectangle */

        const rectangleFour = this.add.image(35, 555, '4').setOrigin(0, 0).setInteractive().setName("four");
        const rectangleSix = this.add.image(107, 555, '6').setOrigin(0, 0).setInteractive().setName("six");
        const rectangleThree = this.add.image(183, 555, '3').setOrigin(0, 0).setInteractive().setName("three");
        const rectangleEight = this.add.image(256, 555, '8').setOrigin(0, 0).setInteractive().setName("eight");
        const rectangleSeven = this.add.image(325, 555, '7').setOrigin(0, 0).setInteractive().setName("seven");
        const rectangleNine = this.add.image(397, 555, '9').setOrigin(0, 0).setInteractive().setName("nine");
        const rectangleTwo = this.add.image(470, 555, '2').setOrigin(0, 0).setInteractive().setName("two");

        /* End Numbers at Rectangle */

        const movingRectangle = this.add.image(0, 535, 'moving-rectangle').setOrigin(0, 0).setInteractive().setName("MOVE-rectangle");
        const self = this;
        this.tweens.add({
            targets: movingRectangle,
            repeat: -1,
            yoyo: true,
            duration: 1250,
            x: 440,
            onComplete: () => {
                self.tweens.add({
                    targets: movingRectangle,
                    repeat: 0,
                    yoyo: true,
                    duration: 1250,
                    x: 0,
                })
            }
        });
        this.input
            .setTopOnly(false)
            .on(
                'pointerdown',
                (
                    pointer,
                    objectsClicked
                ) => {
                    objectsClicked.forEach((obj) => {
                        if (obj.name === arrWithChangingStrings[0]) {
                            arrWithChangingNumbers.splice(0, 1);
                            arrWithChangingStrings.splice(0, 1);
                            text.setText(`Tap ${arrWithChangingNumbers[0]}`)
                        }
                        /* if (Object.keys(objectsClicked).length < 4) {
                            errorSound.play();
                        } else if (obj.name !== arrWithChangingStrings[0]) {
                            errorSound.play();
                        } */
                    })
                }
            );

        /* Load and play Sound  */

        const mainSound = this.sound.add('main');
        /* const errorSound = this.sound.add('error'); */
        /* mainSound.play(); */

        /* LOAD LAST SCENE */
        const darkenRectangle = this.add.rectangle(0, 0, 540, 960, 0x404040).setAlpha(0).setDisplaySize(540, 960).setOrigin(0).setVisible(0);
        const finishLogo = this.add.image(0, 0, 'finishLogo').setOrigin(0).setVisible(0).setDisplaySize(540, 960);
        const button = this.add.image(100, 680, 'button').setOrigin(0, 0).setVisible(0);
        const visibleTime = () => {
            console.log('started');
            self.tweens.add({
                targets: darkenRectangle,
                alpha: { from: 0, to: 0.95 },
                duration: 1250,
                onStart: () => {
                    darkenRectangle.setVisible(1);
                    self.tweens.add({
                        targets: logo,
                        alpha: { from: 1, to: 0 },
                        duration: 1250,
                    });
                },
                onComplete: () => {
                    self.tweens.add({
                        targets: [finishLogo, button],
                        alpha: { from: 0, to: 1 },
                        duration: 750,
                        onStart: () => {
                            finishLogo.setVisible(1);
                            button.setVisible(1);
                        },
                    });
                }
            });
        }
        this.time.addEvent({ delay: 10000, callback: visibleTime, loop: false });
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 540,
    height: 960,
    pixelArt: false,
    scene: [FirstScene]
};

const game = new Phaser.Game(config);