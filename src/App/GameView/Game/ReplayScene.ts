import { Scene } from "phaser";
import { ASSET_ENDPOINTS, GAME, KEYS } from "./constants";

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
    this.load.image(KEYS.PLAYER, ASSET_ENDPOINTS.CIRCLE);
  }

  create() {
    // Set world bounds on collision
    this.matter.world.setBounds(
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

    this.state.player = this.matter.add.image(
      GAME.WIDTH / 2,
      GAME.CANNON_OFFSET,
      KEYS.PLAYER,
    );

    const { player } = this.state;
    player.setCircle(128, {});
    player.setBounce(1);

    const platform = this.matter.add.image(
      GAME.WIDTH / 2 + 100,
      GAME.HEIGHT,
      KEYS.PLAYER,
    );
    platform.setCircle(128, {});
    platform.setStatic(true);
  }
}
