import { isEmpty } from "lodash";
import { getPeg } from "..";
import { ASSET_ENDPOINTS } from "../../../../../assets";
import {
  ResetableTimeout,
  resetableTimeout,
} from "../../../../../global/util/timeout";
import { TurnProps } from "../../../definitions";
import { GAME } from "../constants";
import { GameEvents, ImageType, ObjectType, PegData } from "../definitions";
import { CLEAR_PEG_INTERVAL } from "./constants";
import { GamePeg, PegStatus } from "./definitionts";
import { getNewPlayer } from "./getNewPlayer";
import { removeHitPegs } from "./services";

interface ReplaySceneState {
  player?: Phaser.Physics.Matter.Image;
  pegs: GamePeg[];
}

export class ReplayScene extends Phaser.Scene {
  private state: ReplaySceneState = { pegs: [] };
  private props: TurnProps;

  private clearPegTimeout: ResetableTimeout;

  constructor(props: TurnProps) {
    super(props.sceneKey);
    this.props = props;
  }

  preload() {
    this.load.image(ImageType.Player, ASSET_ENDPOINTS.BALL);
  }

  destroy() {
    this.clearPegTimeout.destroy();
  }

  create() {
    this.clearPegTimeout = resetableTimeout(this.clearPegs, CLEAR_PEG_INTERVAL);
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

    const { cannonAngle, pegs = [] } = this.props;

    if (cannonAngle === null) {
      throw new Error("Cannon start replay with null cannonAngle");
    }

    this.state.player = getNewPlayer(this, { cannonAngle });

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

    this.matter.world.on(
      GameEvents.CollisionStart,
      (event, objectA, objectB) => {
        this.clearPegTimeout.reset();

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

        const pegData = collidedPeg.data.values as PegData;
        this.pegHit(pegData);
      },
    );
  }

  update() {
    const { player } = this.state;

    // If player drops below length of Map, reset
    if (player && player.active && player.y > GAME.HEIGHT) {
      this.startNextScene();
    }
  }

  private startNextScene = () => {
    this.clearPegs();
    this.state.player && this.state.player.destroy();
    const newPegList = this.state.pegs;
    const newCoordinateList = newPegList.map(peg => peg.coordinates);
    this.destroy();
    this.props.endTurn(newCoordinateList);
  };

  private clearPegs = () => {
    this.clearPegTimeout.reset();
    this.state.pegs = removeHitPegs(this.state.pegs);
  };

  private pegHit = (collidedPegData: PegData) => {
    // removePegFromList
    this.state.pegs = this.state.pegs.map(peg => {
      if (peg.key !== collidedPegData.index) {
        return peg;
      }

      if (peg.status === PegStatus.hit) {
        return peg;
      }

      this.props.pointsRecieved(100);
      peg.status = PegStatus.hit;
      return peg;
    });
  };
}
