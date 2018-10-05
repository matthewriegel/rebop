export interface PegCoordinates {
  x: number;
  y: number;
}

export interface TurnProps {
  pegs: PegCoordinates[];
  cannonAngle?: number | null; // radians
  endTurn: () => void;
  fireCannon: (cannonAngle: number) => void;
}
