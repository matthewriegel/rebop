import { PegCoordinates } from "../../definitions";

export const enum PegStatus {
  default = "default",
  hit = "hit",
}

export interface GamePeg {
  coordinates: PegCoordinates;
  key: number;
  status: PegStatus;
  gameObject: Phaser.Physics.Matter.Image;
}
