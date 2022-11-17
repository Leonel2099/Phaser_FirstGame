import Phaser from 'phaser';
export default class Escena extends Phaser.Scene {
    plataforms = null;
    bomb = null;
    player = null
    stars = null
    cursors = null
    score = null;
    scoreText;
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

        //Creando las plataformsas
        this.plataforms = this.physics.add.staticGroup();

        this.plataforms.create(400, 568, 'ground').setScale(2).refreshBody();

        this.plataforms.create(600, 400, 'ground')
        this.plataforms.create(50, 250, 'ground')
        this.plataforms.create(750, 220, 'ground')

        //Agregado de personaje y star
        this.player = this.physics.add.sprite(100, 300, 'dude')

        //fisicas en el juego con colison 
        this.player.setBounce(0.2)
        this.player.setCollideWorldBounds(true)

        //Colcison con las plataformsas
        this.physics.add.collider(this.player, this.plataforms);

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
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 60 }
        });
        this.scoreText = this.add.text(16, 16, 'score: 0', {
            fontSize: '32px', fill: '#000'
        });
        this.physics.add.collider(this.stars, this.plataforms);

        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        })
        //colision player y stars
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this)

        //se agrega las bombas
        this.bomb = this.physics.add.group();

        //colision de las bombas con las plataformsas   
        this.physics.add.collider(this.bomb, this.platforms);

        //colision del pj con las bombas
        this.physics.add.collider(this.player, this.bomb, this.hitBomb, null, this);

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
    collectStar(player, star) {
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });
            var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var bomb = this.bomb.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }
    //funcion cuando el pj choque con una bomba se termine el juego
    hitBomb(player, bomb) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        alert('GAME OVER')
    }
};
