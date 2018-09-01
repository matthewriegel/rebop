import Phaser from "phaser";
import { GAME } from "./constants";

export const getGame = () => {
  const config = {
    type: Phaser.AUTO,
    width: GAME.WIDTH,
    height: GAME.HEIGHT,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: GAME.GRAVITY },
        debug: false,
      },
    },
    scene: {
      preload,
      create,
      update,
    },
  };
  return new Phaser.Game(config);
};

let player;

function preload() {
  const PreloadManager = this;
  PreloadManager.load.image("sky", "assets/missing.png");
  PreloadManager.load.image("ground", "assets/missing.png");
  PreloadManager.load.image("star", "assets/missing.png");
  PreloadManager.load.image("bomb", "assets/missing.png");
  PreloadManager.load.spritesheet("dude", "assets/missing.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
}

function create() {
  const CreateManager = this;
  CreateManager.add.image(400, 300, "sky");

  const platforms = CreateManager.physics.add.staticGroup();

  platforms
    .create(400, 568, "ground")
    .setScale(2)
    .refreshBody();

  platforms.create(600, 400, "ground");
  platforms.create(50, 250, "ground");
  platforms.create(750, 220, "ground");

  player = CreateManager.physics.add.sprite(100, 50, "dude");
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  CreateManager.physics.add.collider(player, platforms);
}

function update() {
  const UpdateManager = this;
  const cursors = UpdateManager.input.keyboard.createCursorKeys();
  if (cursors.left.isDown) {
    player.setVelocityX(-160);

    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);

    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);

    player.anims.play("turn");
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}
