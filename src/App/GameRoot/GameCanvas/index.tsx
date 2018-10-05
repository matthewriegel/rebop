import * as React from "react";
import { TurnProps } from "./definitions";
import { getGame, getScene } from "./Phaser";
import { CanvasStyle, GameViewContainer, OverlayStyle } from "./styles";

class GameCanvas extends React.Component<TurnProps> {
  private canvasRef = React.createRef<HTMLCanvasElement>();
  private game: Phaser.Game;

  public componentDidMount() {
    this.initializeGame();
  }

  public componentDidUpdate() {
    this.destroyGame();
    this.initializeGame();
  }

  public componentWillUnmount() {
    this.destroyGame();
  }

  public render() {
    console.log("rendering game");
    return (
      <div style={GameViewContainer}>
        <div style={OverlayStyle}>Overlay</div>
        <canvas style={CanvasStyle} ref={this.canvasRef}>
          Game
        </canvas>
      </div>
    );
  }

  private initializeGame = () => {
    if (this.canvasRef.current) {
      console.log("initializing game");
      const scene = getScene(this.props);
      this.game = getGame(this.canvasRef.current, scene);
    } else {
      console.log("reference not mounted properly");
    }
  };

  private destroyGame = () => {
    this.game && this.game.destroy(false);
  };
}

export default GameCanvas;
