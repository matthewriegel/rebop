import { isEmpty } from "lodash";
import { ASSET_ENDPOINTS } from "../../../../assets";
import { PegCoordinates } from "../../fixtures";
import { GAME, KEYS } from "../constants";
import { getPeg } from "../services/getPeg";

interface ReadySceneState {
  cannonAngle: number; // radians
  cannon?: Phaser.GameObjects.Image;
}

export interface ReadySceneProps {
  pegs: PegCoordinates[];
}

const DEFAULT_PROPS: ReadySceneProps = {
  pegs: [],
};

export class ReadyScene extends Phaser.Scene {
  private state: ReadySceneState = {
    cannonAngle: 0,
  };
  private props: ReadySceneProps;

  constructor() {
    super(KEYS.SCENES.READY);
  }

  init(data) {
    this.props = isEmpty(data) ? DEFAULT_PROPS : data;
  }

  preload() {
    this.load.image(KEYS.PLAYER, ASSET_ENDPOINTS.BALL);
    this.load.image(KEYS.CANNON, ASSET_ENDPOINTS.CANNON);
  }

  create() {
    const { pegs } = this.props;

    pegs.forEach(item =>
      getPeg(this, item.x * GAME.WIDTH, item.y * GAME.HEIGHT),
    );

    this.state.cannon = this.add.image(
      GAME.CANNON_POSITION.x,
      GAME.CANNON_POSITION.y,
      KEYS.CANNON,
    );
  }
}
