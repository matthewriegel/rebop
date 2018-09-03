import { Scene } from "phaser";
import { ASSET_ENDPOINTS, GAME, KEYS } from "./constants";
import { Sprite } from "./Phaser.definitions";

interface ReplayState {
  player?: Sprite;
}

export class ReplayScene extends Scene {
  private state: ReplayState = {};

  constructor() {
    super(KEYS.SCENES.REPLAY);
  }

  preload() {
    this.load.image(KEYS.PLAYER, ASSET_ENDPOINTS.MISSING);
  }

  create() {
    this.state.player = this.physics.add.sprite(
      GAME.WIDTH / 2,
      GAME.CANNON_OFFSET,
      KEYS.PLAYER,
    );

    const { player } = this.state;
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
  }
}
