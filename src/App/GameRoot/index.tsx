import * as React from "react";
import GameCanvas from "./GameCanvas";
import { PegCoordinates } from "./GameCanvas/definitions";
import { PEG_LIST_FIXTURE } from "./GameCanvas/fixtures";

interface State {
  ballsRemaining: number;
  pegs: PegCoordinates[];
  cannonAngle: number | null;
}

class GameRoot extends React.Component<{}, State> {
  public state: State = {
    ballsRemaining: 10,
    pegs: PEG_LIST_FIXTURE,
    cannonAngle: null,
  };

  render() {
    const { cannonAngle, pegs } = this.state;
    return (
      <GameCanvas
        fireCannon={this.fireCannon}
        cannonAngle={cannonAngle}
        pegs={pegs}
        endTurn={this.endTurn}
      />
    );
  }

  private endTurn = (pegs: PegCoordinates[]) => {
    console.log("Turn End");
    const { ballsRemaining } = this.state;
    this.setState({
      pegs,
      cannonAngle: null,
      ballsRemaining: ballsRemaining - 1,
    });
  };

  private fireCannon = (cannonAngle: number) => {
    console.log("cannon fired", cannonAngle);
    this.setState({ cannonAngle });
  };
}

export default GameRoot;
