import { isEmpty } from "lodash";
import { ASSET_ENDPOINTS } from "../../../../assets";
import { ResetableTimeout, resetableTimeout } from "../../../../global/util/timeout";
import { GAME } from "../constants";
import { GameEvents, ImageType, ObjectType, PegCoordinates, SceneType } from "../definitions";
import { getPeg } from "../services/getPeg";
import { CLEAR_PEG_INTERVAL } from "./constants";
import { GamePeg, PegStatus } from "./definitionts";
import { getNewPlayer } from "./getNewPlayer";
import { removeHitPegs } from "./services";

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

  private clearPegTimeout: ResetableTimeout;

  constructor() {
    super(SceneType.Replay);
  }

  init(data) {
    this.props = isEmpty(data) ? DEFAULT_PROPS : data;
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

    const { cannonAngle, pegs } = this.props;

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

        this.state.pegs = this.state.pegs.map(peg => {
          if (peg.key !== collidedPeg.data.values.index) {
            return peg;
          }

          if (peg.status === PegStatus.hit) {
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
      this.clearPegs();
      this.startNextScene();
    }
  }

  private startNextScene = () => {
    this.clearPegs();
    const newPegList = this.state.pegs;
    const newCoordinateList = newPegList.map(peg => peg.coordinates);
    this.destroy();
    this.scene.start(SceneType.Ready, { pegs: newCoordinateList });
  };

  private clearPegs = () => {
    this.clearPegTimeout.reset();
    this.state.pegs = removeHitPegs(this.state.pegs);
  };
}
