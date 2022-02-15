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
        this.load.image('2', './assets/images/2.png');
        this.load.image('3', './assets/images/3.png');
        this.load.image('4', './assets/images/4.png');
        this.load.image('6', './assets/images/6.png');
        this.load.image('7', './assets/images/7.png');
        this.load.image('8', './assets/images/8.png');
        this.load.image('9', './assets/images/9.png');
        this.load.image('hand','./assets/images/hand.png')

        /* Load Sounds */

        this.load.audio('main', './assets/music/main.mp3')

        /* Finish Objects */
        this.load.image('button', './assets/images/button.png');
        this.load.image('finishLogo', './assets/images/finishlogo.png');
        this.load.image('particles', './assets/images/particles.png');
    }
    create() {
        /*  */

        let isClicked = false;
        let isChanged = false;
        let isFinished = false;
        let index = 0;

        const createInteractiveImage = (x,y,name,interactiveName) => this.add.image(x,y,name).setOrigin(0).setInteractive().setName(interactiveName);
        const createImage = (x,y,name) => this.add.image(x,y,name).setOrigin(0);

        /* Loading Background and Logo*/
        const bg = createInteractiveImage(0, 0, 'bg',"bg");
        const logo = this.add.image(540, 960, 'logo').setPosition(45, 0).setOrigin(0, 0).setScale(1.1);

        /* Text Logic*/
        const arrWithChangingStrings = ['six', 'nine', 'seven', 'four', 'two', 'eight', 'three', 'nine', 'six', 'four', 'two'];
        const arrWithChangingNumbers = [6, 9, 7, 4, 2, 8, 3, 9, 6, 4, 2];

        const text = this.add.text(
            108,
            27,
            `Tap ${arrWithChangingNumbers[0]}`,
            { 
                fontFamily: 'CustomFont', 
                fontSize: '72px',
                fontWeight: 'bold' 
            }
        ).setPosition(180, 360);

        /* Rectangle */

        const rectangle = createInteractiveImage(0, 529, 'main-rectangle','rectangle');

        /* Load Numbers in Rectangle */

        const four = createInteractiveImage(35, 555, '4', "four");
        const six = createInteractiveImage(107, 555, '6', "six");
        const three = createInteractiveImage(183, 555, '3', "three");
        const eight = createInteractiveImage(256, 555, '8', "eight");
        const seven = createInteractiveImage(325, 555, '7', "seven");
        const nine = createInteractiveImage(397, 555, '9', "nine");
        const two = createInteractiveImage(470, 555, '2', "two");

        const arrWithNumbers = [six,nine,seven,four,two,eight,three,nine,six,four,two];

        /* End Numbers at Rectangle */

        const movingRectangle = createInteractiveImage(0, 535, 'moving-rectangle', "MOVE-rectangle");
        const self = this;

        const movingRectangleAnim = this.tweens.add({
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

        /* Logic Of Hint */

        const showHintHand = () => {

            if(isChanged){
                index+=1;
            }

            const x = arrWithNumbers[index].x+10;
            const y = arrWithNumbers[index].y+35;

            this.hand = createImage(x,y,'hand')
                .setScale(0.5)
    
            this.tweens.add({
                targets: this.hand,
                repeat: -1,
                alpha: { from: 0.75, to: 1 },
                duration: 500,
                onStart: ()=> {
                    isChanged = false;
                    this.hand.setVisible(true);
                },
                onComplete:()=>{
                    self.tweens.add({
                        targets: this.hand,
                        repeat: 0,
                        duration: 500,
                        alpha: { from: 1, to: 0.75 },
                    })
                }
            });
        }

        if (!isClicked){
            this.firstHint = this.time.addEvent({ 
                delay: 2000, 
                callback: showHintHand,
                loop: false 
            });
        }

        /* Finish Logic Of Hint */

        this.input
            .setTopOnly(false)
            .on(
                'pointerdown',
                (   pointer,
                    objectsClicked
                ) => {
                    objectsClicked.forEach((obj) => {
                        if (obj.name === arrWithChangingStrings[0] && objectsClicked.length === 3) {
                            isChanged = true;

                            if(this.hand){
                                this.hand.setVisible(false);
                            }

                            this.firstHint.remove();

                            if(!isFinished){
                                this.hint = this.time.addEvent({ 
                                    delay: 2000, 
                                    callback: showHintHand,
                                    loop: false 
                                });
                            }else{
                                this.hint.remove();
                            }

                            arrWithChangingNumbers.splice(0, 1);
                            arrWithChangingStrings.splice(0, 1);

                            text.setText(`Tap ${arrWithChangingNumbers[0]}`)
                        }
                    })
                }
            );

        /* Load and play Sound  */

        const mainSound = this.sound.add('main');
        mainSound.play();

        /* LOAD LAST SCENE */
        const darkenRectangle = this.add.rectangle(0, 0, 540, 960, 0x404040)
            .setAlpha(false)
            .setDisplaySize(540, 960)
            .setOrigin(0)
            .setVisible(0);

        const finishLogo = this.add.image(0, 0, 'finishLogo')
            .setOrigin(0)
            .setVisible(false)
        
        const particles = this.add.image(0,0,'particles')
            .setOrigin(0, 0)
            .setVisible(false);

        const button = this.add.image(100, 680, 'button')
            .setOrigin(0, 0)
            .setVisible(false);

        const visibleTime = () => {
            self.tweens.add({
                targets: darkenRectangle,
                alpha: { from: 0, to: 0.97 },
                duration: 1250,
                onStart: () => {
                    isFinished = true;
                    self.hand.setVisible(false);
                    darkenRectangle.setVisible(true);
                    movingRectangleAnim.pause();
                    self.tweens.add({
                        targets: logo,
                        alpha: { from: 1, to: 0 },
                        duration: 1250,
                    });
                },
                onComplete: () => {
                    self.tweens.add({
                        targets: [finishLogo, button,particles],
                        alpha: { from: 0, to: 1 },
                        duration: 750,
                        onStart: () => {
                            finishLogo.setVisible(true);
                            button.setVisible(true);
                            particles.setVisible(true);
                        },
                        onComplete: ()=> {
                            particlesAnim()
                        }
                    });
                }
            });
        }
        const particlesAnim = () => {
            this.tweens.add({
                targets: particles,
                repeat: -1,
                alpha: { from: 1, to: 0.5 },
                duration: 500,
                yoyo:true,
            });
        }
        this.finishEvent = this.time.addEvent({ delay: 3000, callback: visibleTime, loop: false });
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