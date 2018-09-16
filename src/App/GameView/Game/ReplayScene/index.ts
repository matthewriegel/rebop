import { isEmpty } from "lodash";
import { ASSET_ENDPOINTS } from "../../../../assets";
import { PegCoordinates } from "../../fixtures";
import { GAME } from "../constants";
import { GameEvents, ImageType, ObjectType, SceneType } from "../definitions";
import { getPeg } from "../services/getPeg";
import { removeHitPegs } from "./services";

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

interface ReplaySceneState {
  player?: Phaser.Physics.Matter.Image;
  pegs: GamePeg[];
}

export interface ReplaySceneProps {
  cannonAngle: number; // radians
  pegs: PegCoordinates[];
}

const DEFAULT_PROPS: ReplaySceneProps = {
  cannonAngle: 3,
  pegs: [],
};

export class ReplayScene extends Phaser.Scene {
  private state: ReplaySceneState = { pegs: [] };
  private props: ReplaySceneProps;

  constructor() {
    super(SceneType.Replay);
  }

  init(data) {
    this.props = isEmpty(data) ? DEFAULT_PROPS : data;
  }

  preload() {
    this.load.image(ImageType.Player, ASSET_ENDPOINTS.BALL);
  }

  create() {
    // Set world bounds on collision
    this.matter.world.setBounds(
      0,
      0,
      GAME.WIDTH,
      GAME.HEIGHT,
      32,
      true,
      true,
      true,
      false, // No bottom collision so we know when the ball has exited
    );

    this.state.player = this.matter.add.image(
      GAME.CANNON_POSITION.x,
      GAME.CANNON_POSITION.y,
      ImageType.Player,
    );

    const { player } = this.state;
    const { cannonAngle, pegs } = this.props;

    const xVelocity = Math.cos(cannonAngle);
    const yVelocity = Math.sin(cannonAngle);

    player.setCircle(GAME.PLAYER_RADIUS, {});
    player.setBounce(0.9);
    player.setFriction(0, 0);
    player.setVelocity(
      xVelocity * GAME.CANNON_STRENGTH,
      yVelocity * GAME.CANNON_STRENGTH,
    );
    player.setSleepEvents(true, true);
    player.setName(ObjectType.Player);

    this.state.pegs = pegs.map(
      (item, index): GamePeg => {
        const newPeg = getPeg(
          this,
          item.x * GAME.WIDTH,
          item.y * GAME.HEIGHT,
          index,
        );
        return {
          coordinates: item,
          status: PegStatus.default,
          key: index,
          gameObject: newPeg,
        };
      },
    );

    // If player body sleeps, rest
    this.matter.world.on(GameEvents.SleepStart, () => {
      this.state.pegs = removeHitPegs(this.state.pegs);
      // TODO: Set wake event
    });

    this.matter.world.on(
      GameEvents.CollisionStart,
      (event, objectA, objectB) => {
        const imageA: Phaser.Physics.Matter.Image = objectA.gameObject;
        const imageB: Phaser.Physics.Matter.Image = objectB.gameObject;

        if (isEmpty(imageA) || isEmpty(imageB)) {
          return;
        }

        const collidedPlayer = [imageA, imageB].find(
          image => image.name === ObjectType.Player,
        );

        const collidedPeg = [imageA, imageB].find(
          image => image.name === ObjectType.Peg,
        );

        if (!collidedPlayer || !collidedPeg) {
          return;
        }

        this.state.pegs = this.state.pegs.map(peg => {
          if (peg.key !== collidedPeg.data.values.index) {
            return peg;
          }
          peg.status = PegStatus.hit;
          return peg;
        });
      },
    );
  }

  update() {
    const { player, pegs } = this.state;

    // If player drops below length of Map, reset
    if (player && player.y > GAME.HEIGHT) {
      const newPegList = removeHitPegs(this.state.pegs);
      const newCoordinateList = newPegList.map(peg => peg.coordinates);
      this.scene.start(SceneType.Ready, { pegs: newCoordinateList });
    }
  }
}
