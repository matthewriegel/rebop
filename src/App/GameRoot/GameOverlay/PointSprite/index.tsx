import * as React from "react";

interface Props {
  points: number;
  transitionEnd(): void;
}

const PointSprite = ({ points, transitionEnd }: Props) => <div>+ {points}</div>;

export default PointSprite;
