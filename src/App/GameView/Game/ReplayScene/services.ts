import { GamePeg, PegStatus } from "./";

export const removeHitPegs = (pegList: GamePeg[]) =>
  pegList.filter(peg => {
    if (peg.status !== PegStatus.hit) {
      return true;
    }

    peg.gameObject.destroy();
    return false;
  });
