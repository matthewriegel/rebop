import { flatten, range, times } from "lodash";

interface PegCoordinates {
  x: number;
  y: number;
}

const PEG_HEIGHT = 5;
const PEG_WIDTH = 5;
export const pegList: PegCoordinates[] = flatten(
  times(
    PEG_WIDTH,
    (xIndex): PegCoordinates[] =>
      range(1, PEG_HEIGHT).map(
        (yIndex): PegCoordinates => ({
          x: (xIndex + 0.5) / PEG_WIDTH,
          y: (yIndex + 0.5) / PEG_HEIGHT,
        }),
      ),
  ),
);
