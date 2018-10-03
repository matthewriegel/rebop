import * as React from "react";
import { PEG_LIST_FIXTURE } from "./fixtures";
import { getGame } from "./Game";
import { PegCoordinates } from "./Game/definitions";
import { CanvasStyle, GameViewContainer, OverlayStyle } from "./styles";

interface State {
  game: any;
}

interface Props {
  cannonAng: number;
  pegs: PegCoordinates[];
}

export default class Game extends React.Component<{}, State> {
  private canvasRef = React.createRef<HTMLCanvasElement>();

  public game;

  public componentDidMount() {
    if (this.canvasRef.current) {
      this.game = getGame(this.canvasRef.current, {
        turnOver: this.turnOver,
        pegs: PEG_LIST_FIXTURE,
      });
    } else {
      console.log("reference not mounted properly");
    }
  }

  public render() {
    return (
      <div style={GameViewContainer}>
        <div style={OverlayStyle}>Overlay</div>
        <canvas style={CanvasStyle} ref={this.canvasRef}>
          Game
        </canvas>
      </div>
    );
  }

  private turnOver = () => {
    console.log("turn end");
  };
}
