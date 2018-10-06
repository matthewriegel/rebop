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
  sceneCount: number;
  pointSprites: PointSprite[];
  pointSpriteCount: number;
}

const DEFAULT_STATE: State = {
  ballsRemaining: 10,
  pegs: PEG_LIST_FIXTURE,
  sceneCount: 0,
  cannonAngle: null,
  pointSprites: [],
  pointSpriteCount: 0,
};

class GameRoot extends React.Component<{}, State> {
  public state: State = DEFAULT_STATE;

  render() {
    const {
      cannonAngle,
      pegs,
      ballsRemaining,
      pointSprites,
      sceneCount,
    } = this.state;
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
          pointsRecieved={this.pointsRecieved}
          sceneKey={`${sceneCount}`}
        />
      </div>
    );
  }

  private endTurn = (pegs: PegCoordinates[]) => {
    console.log("Turn End");
    const { ballsRemaining, sceneCount } = this.state;
    if (ballsRemaining <= 0 || !pegs.length) {
      this.endGame();
    } else {
      this.setState({
        pegs,
        cannonAngle: null,
        sceneCount: sceneCount + 1,
      });
    }
  };

  private fireCannon = (cannonAngle: number) => {
    console.log("cannon fired", cannonAngle);
    const { ballsRemaining, sceneCount } = this.state;
    this.setState({
      cannonAngle,
      ballsRemaining: ballsRemaining - 1,
      sceneCount: sceneCount + 1,
    });
  };

  private endGame = () => {
    alert("GAME OVER");
    this.setState(DEFAULT_STATE);
  };

  private removePointSprite = (key: string) => {
    const { pointSprites } = this.state;
    const newSpriteList = pointSprites.filter(
      pointSprite => pointSprite.key !== key,
    );
    this.setState({ pointSprites: newSpriteList });
  };

  private pointsRecieved = (points: number) => {
    const { pointSprites, pointSpriteCount } = this.state;
    const newSpriteCount = pointSpriteCount + 1;
    const key = `${newSpriteCount}`;
    const newSprite: PointSprite = {
      key,
      amount: points,
      transitionEnd: () => {
        this.removePointSprite(key);
      },
    };

    this.setState({
      pointSprites: [...pointSprites, newSprite],
      pointSpriteCount: newSpriteCount,
    });
  };
}

export default GameRoot;
