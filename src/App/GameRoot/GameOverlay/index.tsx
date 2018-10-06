import * as React from "react";
import { OverlayStyle } from "./styles";

export interface PointSprite {
  amount: number;
  key: string;
}

interface Props {
  pointSprites: PointSprite[];
  ballsRemaining: number;
}

const GameOverlay: React.SFC<Props> = ({
  pointSprites,
  ballsRemaining,
}: Props) => <div style={OverlayStyle}>Turns remaining: {ballsRemaining}</div>;

export default GameOverlay;
