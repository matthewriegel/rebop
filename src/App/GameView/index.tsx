import * as React from "react";
import { getGame } from "./Game";
import { CanvasStyle, GameViewContainer, OverlayStyle } from "./styles";

interface State {
  game: any;
}

export default class Game extends React.Component<{}, State> {
  private canvasRef: HTMLCanvasElement;

  public game;

  public componentDidMount() {
    this.game = getGame(this.canvasRef);
  }

  public render() {
    return (
      <div style={GameViewContainer}>
        <div style={OverlayStyle}>Overlay</div>
        <canvas
          style={CanvasStyle}
          ref={(ref: HTMLCanvasElement) => (this.canvasRef = ref)}
        >
          Game
        </canvas>
      </div>
    );
  }
}
