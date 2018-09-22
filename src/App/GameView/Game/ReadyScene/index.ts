import { isEmpty } from "lodash";
import { ASSET_ENDPOINTS } from "../../../../assets";
import { GAME } from "../constants";
import {
  GameEvents,
  ImageType,
  PegCoordinates,
  SceneType,
} from "../definitions";
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
    super(SceneType.Ready);
  }

  init(data) {
    this.props = isEmpty(data) ? DEFAULT_PROPS : data;
  }

  preload() {
    this.load.image(ImageType.Player, ASSET_ENDPOINTS.BALL);
    this.load.image(ImageType.Cannon, ASSET_ENDPOINTS.CANNON);
  }

  create() {
    const { pegs } = this.props;

    pegs.forEach((item, index) =>
      getPeg(this, item.x * GAME.WIDTH, item.y * GAME.HEIGHT, index),
    );

    this.state.cannon = this.add.image(
      GAME.CANNON_POSITION.x,
      GAME.CANNON_POSITION.y,
      ImageType.Cannon,
    );
    const { cannon } = this.state;

    cannon.setRotation(Math.PI * 0.5);

    // DRAG CONTROLS
    const controlPanelPoints = {
      xOrigin: 0,
      yOrigin: 0,
      xDelta: GAME.WIDTH,
      yDelta: GAME.HEIGHT * 0.7,
    };
    const dragZone = this.add.zone(
      controlPanelPoints.xOrigin + controlPanelPoints.xDelta / 2,
      controlPanelPoints.yOrigin + controlPanelPoints.yDelta / 2,
      controlPanelPoints.xDelta,
      controlPanelPoints.yDelta,
    );
    dragZone.setInteractive();
    this.input.setDraggable(dragZone);

    // FIRE CONTROLS
    const firePanelPoints = {
      xOrigin: 0,
      yOrigin: GAME.HEIGHT * 0.7,
      xDelta: GAME.WIDTH,
      yDelta: GAME.HEIGHT * 0.3,
    };
    const fireRect = new Phaser.Geom.Rectangle(
      firePanelPoints.xOrigin,
      firePanelPoints.yOrigin,
      firePanelPoints.xDelta,
      firePanelPoints.yDelta,
    );
    const fireControlPad = this.add.graphics({
      fillStyle: { color: 0xff0000, alpha: 0.2 },
    });
    fireControlPad.fillRectShape(fireRect);
    const fireZone = this.add.zone(
      firePanelPoints.xOrigin + firePanelPoints.xDelta / 2,
      firePanelPoints.yOrigin + firePanelPoints.yDelta / 2,
      firePanelPoints.xDelta,
      firePanelPoints.yDelta,
    );
    fireZone.setInteractive();
    fireZone.on(GameEvents.PointerDown, () => {
      this.scene.start(SceneType.Replay, {
        cannonAngle: cannon.rotation,
        pegs,
      });
    });

    // Set cannon controls
    this.input.on(GameEvents.Drag, (pointer, gameObject, dragX, dragY) => {
      const previousX = pointer.position.x;
      const currentX = pointer.prevPosition.x;
      const deltaX = currentX - previousX;
      cannon.setRotation(cannon.rotation + deltaX / 100);
    });
  }
}
