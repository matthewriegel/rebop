import { GAME } from "../constants";
import { ImageType, ObjectType } from "../definitions";

export interface PegData {
  index: number;
}

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
