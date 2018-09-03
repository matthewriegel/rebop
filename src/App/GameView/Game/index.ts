import { AUTO, Game, Scene } from "phaser";
import { ASSET_ENDPOINTS, GAME, KEYS } from "./constants";

const PHYSICS_ENGINE = "arcade";

export const getGame = () => {
  const config: GameConfig = {
    type: AUTO,
    width: GAME.WIDTH,
    height: GAME.HEIGHT,
    physics: {
      default: PHYSICS_ENGINE,
      arcade: {
        gravity: { y: GAME.GRAVITY },
        debug: false,
      },
    },
    scene: [ReplayScene],
  };
  return new Game(config);
};

interface ReplayState {
  player?;
}

class ReplayScene extends Scene {
  private state: ReplayState = {};

  constructor() {
    super(KEYS.SCENES.REPLAY);
  }

  preload() {
    this.load.image(KEYS.PLAYER, ASSET_ENDPOINTS.MISSING);
  }

  create() {
    this.state.player = this.physics.add.sprite(100, 50, KEYS.PLAYER);

    const { player } = this.state;
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
  }
}
