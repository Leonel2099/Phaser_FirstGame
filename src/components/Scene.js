import Phaser from 'phaser';
export default class Escena extends Phaser.Scene {
    plataform = null;
    play = null
    stars = null
    cursors = null
    preload() {
        this.load.image('sky', "assets/img/sky.png");
        this.load.image('ground', 'assets/img/platform.png');
        this.load.image('star', 'assets/img/star.png');
        this.load.image('bomb', 'assets/img/bomb.png');
        this.load.spritesheet('dude',
            'assets/img/dude.png',
            { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        //Agregando el fondo
        this.add.image(400, 300, 'sky');

        //Creando las plataformas
        this.plataform = this.physics.add.staticGroup();

        this.plataform.create(400, 568, 'ground').setScale(2).refreshBody();

        this.plataform.create(600, 400, 'ground')
        this.plataform.create(50, 250, 'ground')
        this.plataform.create(750, 220, 'ground')

        //Agregado de personaje y star
        this.player = this.physics.add.sprite(100, 300, 'dude')

        //fisicas en el juego con colison 
        this.player.setBounce(0.2)
        this.player.setCollideWorldBounds(true)

        //Colcison con las plataformas
        this.physics.add.collider(this.player, this.plataform);

        this.cursors = this.input.keyboard.createCursorKeys();

        //Movimientos(se usan en el Update)
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        //Agregado de Estrellas
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 15,
            setXY: { x: 12, y: 0, stepX: 60 }
        });
        this.physics.add.collider(this.stars, this.plataform);

        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        })
        //colision player y stars
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this)
    }

    update() {
        //Movimiento con las teclas direccionales
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true)
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160)
            this.player.anims.play('right', true)
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn')
        }

        //Salto si toca el suelo
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-280)
        }

    }
    //Colision con playes con stars para que se desasaparezcan 
    collectStar(player, star){
        star.disableBody(true, true);

    }
};
