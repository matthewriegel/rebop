import { PegCoordinates } from "../../definitions";
import { GAME } from "../constants";
import { ImageType, ObjectType } from "../definitions";

export interface Props {
  cannonAngle?: number;
  position?: PegCoordinates;
}

const DEFAULT_POSITION: PegCoordinates = {
  x: GAME.CANNON_POSITION.x,
  y: GAME.CANNON_POSITION.y,
};

export const getNewPlayer = (scene: Phaser.Scene, props: Props) => {
  const { cannonAngle, position = DEFAULT_POSITION } = props;

  const player = scene.matter.add.image(
    position.x,
    position.y,
    ImageType.Player,
  );

  player.setCircle(GAME.PLAYER_RADIUS, {});
  player.setBounce(0.9);
  player.setFriction(0, 0);

  if (cannonAngle) {
    const xVelocity = Math.cos(cannonAngle);
    const yVelocity = Math.sin(cannonAngle);
    player.setVelocity(
      xVelocity * GAME.CANNON_STRENGTH,
      yVelocity * GAME.CANNON_STRENGTH,
    );
  }

  setTimeout(() => player.setSleepEvents(true, true));
  player.setName(ObjectType.Player);
  return player;
};
