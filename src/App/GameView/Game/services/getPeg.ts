import { GAME, KEYS } from "../constants";

export const getPeg = (
  scene: Phaser.Scene,
  xCoordinate: number,
  yCoordinate: number,
): Phaser.Physics.Matter.Image => {
  const platform = scene.matter.add.image(
    xCoordinate,
    yCoordinate,
    KEYS.PLAYER,
  );
  platform.setCircle(GAME.PEG_RADIUS, {});
  platform.setStatic(true);
  return platform;
};
