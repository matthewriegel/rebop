import { isEmpty } from "lodash";
import { ASSET_ENDPOINTS } from "../../../../assets";
import { PegCoordinates } from "../../fixtures";
import { EVENTS, GAME, KEYS } from "../constants";
import { getPeg } from "./getPeg";

interface ReplaySceneState {
  player?: Phaser.Physics.Matter.Image;
}

export interface ReplaySceneProps {
  cannonAngle: number; // radians
  pegs: PegCoordinates[];
}

export class ReplayScene extends Phaser.Scene {
  private state: ReplaySceneState = {};
  private props: ReplaySceneProps;

  constructor() {
    super(KEYS.SCENES.REPLAY);
  }

  init(data) {
    this.props = isEmpty(data) ? { cannonAngle: 3 } : data;
  }

  preload() {
    this.load.image(KEYS.PLAYER, ASSET_ENDPOINTS.BALL);
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
      true,
    );

    this.state.player = this.matter.add.image(
      GAME.WIDTH / 2,
      GAME.CANNON_OFFSET,
      KEYS.PLAYER,
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

    pegs.forEach(item =>
      getPeg(this, item.x * GAME.WIDTH, item.y * GAME.HEIGHT),
    );

    const props: ReplaySceneProps = { cannonAngle: 1, pegs };
    this.input.once(EVENTS.POINTER_DOWN, () => {
      this.scene.start(KEYS.SCENES.REPLAY, props);
    });
    this.matter.world.on(EVENTS.SLEEP_START, () => {
      this.scene.start(KEYS.SCENES.REPLAY, props);
    });
  }
}
