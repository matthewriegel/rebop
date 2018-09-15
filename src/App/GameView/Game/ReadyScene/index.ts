import { isEmpty } from "lodash";
import { ASSET_ENDPOINTS } from "../../../../assets";
import { PegCoordinates } from "../../fixtures";
import { EVENTS, GAME, KEYS } from "../constants";
import { getPeg } from "../services/getPeg";

interface ReadySceneState {
  cannon?: Phaser.GameObjects.Image;
}

export interface ReadySceneProps {
  pegs: PegCoordinates[];
}

const DEFAULT_PROPS: ReadySceneProps = {
  pegs: [],
};

export class ReadyScene extends Phaser.Scene {
  private state: ReadySceneState = {};
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
    const { cannon } = this.state;

    cannon.setRotation(Math.PI * 0.5);

    const controlPanelPoints = {
      xOrigin: 0,
      yOrigin: 0,
      xDelta: GAME.WIDTH,
      yDelta: GAME.HEIGHT * 0.7,
    };
    const cannonRect = new Phaser.Geom.Rectangle(
      controlPanelPoints.xOrigin,
      controlPanelPoints.yOrigin,
      controlPanelPoints.xDelta,
      controlPanelPoints.yDelta,
    );
    const cannonControlPad = this.add.graphics({
      fillStyle: { color: 0x0000ff, alpha: 0.2 },
    });
    cannonControlPad.fillRectShape(cannonRect);

    const zone = this.add.zone(
      controlPanelPoints.xOrigin + controlPanelPoints.xDelta / 2,
      controlPanelPoints.yOrigin + controlPanelPoints.yDelta / 2,
      controlPanelPoints.xDelta,
      controlPanelPoints.yDelta,
    );
    zone.setInteractive();
    this.input.setDraggable(zone);

    // Set cannon controls
    this.input.on(EVENTS.DRAG, (pointer, gameObject, dragX, dragY) => {
      const previousX = pointer.position.x;
      const currentX = pointer.prevPosition.x;
      const deltaX = currentX - previousX;
      cannon.setRotation(cannon.rotation + deltaX / 100);
    });
  }
}
