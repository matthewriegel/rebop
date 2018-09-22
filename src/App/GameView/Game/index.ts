import { AUTO, Game } from "phaser";
import { PEG_LIST_FIXTURE } from "../fixtures";
import { GAME } from "./constants";
import { SceneType } from "./definitions";
import { ReadyScene } from "./ReadyScene";
import { ReplayScene, ReplaySceneProps } from "./ReplayScene";

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
    scene: [ReadyScene, ReplayScene],
  };
  const game = new Game(config);
  const props: ReplaySceneProps = {
    pegs: PEG_LIST_FIXTURE,
    cannonAngle: 0,
  };

  game.scene.start(SceneType.Ready, props);
  return game;
};
