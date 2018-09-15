import { isEmpty } from "lodash";
import { ASSET_ENDPOINTS } from "../../../../assets";
import { PegCoordinates } from "../../fixtures";
import { EVENTS, GAME, KEYS } from "../constants";
import { getPeg } from "../services/getPeg";

interface ReplaySceneState {
  player?: Phaser.Physics.Matter.Image;
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
  private state: ReplaySceneState = {};
  private props: ReplaySceneProps;

  constructor() {
    super(KEYS.SCENES.REPLAY);
  }

  init(data) {
    this.props = isEmpty(data) ? DEFAULT_PROPS : data;
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
      false, // No bottom collision so we know when the ball has exited
    );

    this.state.player = this.matter.add.image(
      GAME.CANNON_POSITION.x,
      GAME.CANNON_POSITION.y,
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

    // If user clicks, reset
    this.input.once(EVENTS.POINTER_DOWN, () => {
      this.scene.start(KEYS.SCENES.REPLAY, props);
    });

    // If player body sleeps, rest
    this.matter.world.on(EVENTS.SLEEP_START, () => {
      this.scene.start(KEYS.SCENES.REPLAY, props);
    });
  }

  update() {
    const { pegs } = this.props;
    const { player } = this.state;

    // If player drops below length of Map, reset
    if (player && player.y > GAME.HEIGHT) {
      const props: ReplaySceneProps = { cannonAngle: 2, pegs };
      this.scene.start(KEYS.SCENES.REPLAY, props);
    }
  }
}
