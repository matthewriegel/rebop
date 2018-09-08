import { Scene } from "phaser";
import { ASSET_ENDPOINTS } from "../../../../assets";
import { GAME, KEYS } from "../constants";
import { pegList } from "./fixtures";
import { getPeg } from "./getPeg";

type PhaserImage = Phaser.Physics.Matter.Image;

interface ReplayState {
  player?: PhaserImage;
}

export class ReplayScene extends Scene {
  private state: ReplayState = {};

  constructor() {
    super(KEYS.SCENES.REPLAY);
  }

  preload() {
    const scene: Phaser.Scene = this;
    scene.load.image(KEYS.PLAYER, ASSET_ENDPOINTS.BALL);
  }

  create() {
    const scene: Phaser.Scene = this;
    // Set world bounds on collision
    scene.matter.world.setBounds(
      0,
      0,
      GAME.WIDTH,
      GAME.HEIGHT,
      32,
      true,
      true,
      true,
      true,
    );

    this.state.player = scene.matter.add.image(
      GAME.WIDTH / 2 + 1,
      GAME.CANNON_OFFSET,
      KEYS.PLAYER,
    );

    const { player } = this.state;
    player.setCircle(GAME.PLAYER_RADIUS, {});
    player.setBounce(0.9);
    player.setFriction(0, 0);

    pegList.forEach(item =>
      getPeg(scene, item.x * GAME.WIDTH, item.y * GAME.HEIGHT),
    );
  }
}
