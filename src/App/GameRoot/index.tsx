import * as React from "react";
import { PegCoordinates } from "./definitions";
import { PEG_LIST_FIXTURE } from "./fixtures";
import GameCanvas from "./GameCanvas";
import GameOverlay, { PointSprite } from "./GameOverlay";
import { GameViewContainer } from "./styles";

interface State {
  ballsRemaining: number;
  pegs: PegCoordinates[];
  cannonAngle: number | null;
  pointSprites: PointSprite[];
}

const DEFAULT_STATE: State = {
  ballsRemaining: 10,
  pegs: PEG_LIST_FIXTURE,
  cannonAngle: null,
  pointSprites: [],
};

class GameRoot extends React.Component<{}, State> {
  public state: State = DEFAULT_STATE;

  render() {
    const { cannonAngle, pegs, ballsRemaining, pointSprites } = this.state;
    return (
      <div style={GameViewContainer}>
        <GameOverlay
          ballsRemaining={ballsRemaining}
          pointSprites={pointSprites}
        />
        <GameCanvas
          fireCannon={this.fireCannon}
          cannonAngle={cannonAngle}
          pegs={pegs}
          endTurn={this.endTurn}
        />
      </div>
    );
  }

  private endTurn = (pegs: PegCoordinates[]) => {
    console.log("Turn End");
    const { ballsRemaining } = this.state;
    if (ballsRemaining <= 0 || !pegs.length) {
      this.endGame();
    } else {
      this.setState({
        pegs,
        cannonAngle: null,
      });
    }
  };

  private fireCannon = (cannonAngle: number) => {
    console.log("cannon fired", cannonAngle);
    const { ballsRemaining } = this.state;
    this.setState({
      cannonAngle,
      ballsRemaining: ballsRemaining - 1,
    });
  };

  private endGame = () => {
    alert("GAME OVER");
    this.setState(DEFAULT_STATE);
  };
}

export default GameRoot;
