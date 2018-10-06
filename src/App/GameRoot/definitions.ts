export interface PegCoordinates {
  x: number;
  y: number;
}

export interface TurnProps {
  sceneKey: string;
  pegs: PegCoordinates[];
  cannonAngle?: number | null; // radians
  endTurn: (pegs: PegCoordinates[]) => void;
  fireCannon: (cannonAngle: number) => void;
  pointsRecieved: (points: number) => void;
}
