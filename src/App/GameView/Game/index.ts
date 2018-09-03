import { AUTO, Game } from "phaser";
import { GAME } from "./constants";
import { ReplayScene } from "./ReplayScene";

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
