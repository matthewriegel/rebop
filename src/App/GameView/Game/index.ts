import { AUTO, Game } from "phaser";
import { GAME } from "./constants";
import { ReplayScene } from "./ReplayScene";

const PHYSICS_ENGINE = "matter";

export const getGame = (canvas: HTMLCanvasElement) => {
  const contextConfig = {
    alpha: false,
    depth: false,
    antialias: true,
    premultipliedAlpha: true,
    stencil: true,
    preserveDrawingBuffer: false,
    failIfMajorPerformanceCaveat: false,
    powerPreference: "default",
  };

  const context =
    canvas.getContext("webgl2", contextConfig) ||
    (canvas.getContext("2d", contextConfig) as any);
  if (!context) {
    throw new Error("Webgl not supported");
  }

  const config: GameConfig = {
    type: AUTO,
    width: GAME.WIDTH,
    height: GAME.HEIGHT,
    canvas,
    context,
    physics: {
      default: PHYSICS_ENGINE,
    },
    scene: [ReplayScene],
  };
  return new Game(config);
};
