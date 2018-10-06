import * as React from "react";
import PointSprite from "./PointSprite";
import { OverlayStyle } from "./styles";

export interface PointSprite {
  amount: number;
  key: string;
  transitionEnd: () => void;
}

interface Props {
  pointSprites: PointSprite[];
  ballsRemaining: number;
}

const GameOverlay: React.SFC<Props> = ({ pointSprites, ballsRemaining }) => (
  <div style={OverlayStyle}>
    <div>Turns remaining: {ballsRemaining}</div>
    {pointSprites.map(pointSprite => (
      <PointSprite
        key={pointSprite.key}
        points={pointSprite.amount}
        transitionEnd={pointSprite.transitionEnd}
      />
    ))}
  </div>
);

export default GameOverlay;
