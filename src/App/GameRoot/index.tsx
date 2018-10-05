import * as React from "react";
import GameCanvas from "./GameCanvas";
import { PEG_LIST_FIXTURE } from "./GameCanvas/fixtures";

interface State {
  ballsRemaining: number;
  cannonAngle: number | null;
}

class GameRoot extends React.Component<{}, State> {
  public state: State = {
    ballsRemaining: 10,
    cannonAngle: null,
  };

  render() {
    const { cannonAngle } = this.state;
    return (
      <GameCanvas
        fireCannon={this.fireCannon}
        cannonAngle={cannonAngle}
        pegs={PEG_LIST_FIXTURE}
        endTurn={this.endTurn}
      />
    );
  }

  private endTurn = () => {
    console.log("Turn End");
    this.setState({ cannonAngle: null });
  };

  private fireCannon = (cannonAngle: number) => {
    console.log("cannon fired", cannonAngle);
    this.setState({ cannonAngle });
  };
}

export default GameRoot;
