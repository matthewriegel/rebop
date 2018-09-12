import { isEmpty } from "lodash";
import { Scene } from "phaser";
import { ASSET_ENDPOINTS } from "../../../../assets";
import { GAME, KEYS } from "../constants";
import { pegList } from "./fixtures";
import { getPeg } from "./getPeg";

type PhaserImage = Phaser.Physics.Matter.Image;

interface ReplayState {
  player?: PhaserImage;
}

interface ReplayProps {
  cannonAngle: number; // radians
}

export class ReplayScene extends Scene {
  private state: ReplayState = {};
  private props: ReplayProps;

  constructor() {
    super(KEYS.SCENES.REPLAY);
  }

  init(data) {
    this.props = isEmpty(data) ? { cannonAngle: 3 } : data;
  }

  preload() {
    const scene: Phaser.Scene = this;
    scene.load.image(KEYS.PLAYER, ASSET_ENDPOINTS.BALL);
  }

  create() {
    const scene: Phaser.Scene = this;
    // Set world bounds on collision
    scene.matter.world.setBounds(
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

    this.state.player = scene.matter.add.image(
      GAME.WIDTH / 2,
      GAME.CANNON_OFFSET,
      KEYS.PLAYER,
    );

    const { player } = this.state;
    const { cannonAngle } = this.props;

    const xVelocity = Math.cos(cannonAngle);
    const yVelocity = Math.sin(cannonAngle);

    player.setCircle(GAME.PLAYER_RADIUS, {});
    player.setBounce(0.9);
    player.setFriction(0, 0);
    player.setVelocity(xVelocity, yVelocity);

    pegList.forEach(item =>
      getPeg(scene, item.x * GAME.WIDTH, item.y * GAME.HEIGHT),
    );

    const props: ReplayProps = { cannonAngle: 1 };
    scene.input.once("pointerdown", () => {
      scene.scene.start(KEYS.SCENES.REPLAY, props);
    });
  }
}
