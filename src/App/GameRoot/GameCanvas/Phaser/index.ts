import { AUTO, Game } from "phaser";
import { TurnProps } from "../definitions";
import { GAME } from "./constants";
import { ImageType, ObjectType, PegData } from "./definitions";
import { ReadyScene } from "./ReadyScene";
import { ReplayScene } from "./ReplayScene";

const PHYSICS_ENGINE = "matter";

export const getGame = (
  canvas: HTMLCanvasElement,
  scene: Phaser.Scene,
): Game => {
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
    scene,
  };
  const game = new Game(config);
  return game;
};

export const getPeg = (
  scene: Phaser.Scene,
  xCoordinate: number,
  yCoordinate: number,
  index: number,
): Phaser.Physics.Matter.Image => {
  const peg = scene.matter.add.image(
    xCoordinate,
    yCoordinate,
    ImageType.Player,
  );
  peg.setCircle(GAME.PEG_RADIUS, {});
  peg.setStatic(true);
  peg.setName(ObjectType.Peg);
  peg.setData({ index } as PegData);
  return peg;
};

export const getScene = (props: TurnProps): Phaser.Scene =>
  props.cannonAngle === null ? new ReadyScene(props) : new ReplayScene(props);
