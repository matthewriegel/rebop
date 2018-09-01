import * as React from "react";
import { getGame } from "./Game";

interface State {
  game: any;
}

export default class Game extends React.Component<{}, State> {
  public game;

  public componentDidMount() {
    this.game = getGame();
  }

  public render() {
    return <div>Game</div>;
  }
}
