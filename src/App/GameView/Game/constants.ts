const DPR = 1;
const GAME_WIDTH = 400;
const HEIGHT_RATIO = 1.5;

export const GAME = {
  HEIGHT: GAME_WIDTH * DPR * HEIGHT_RATIO,
  WIDTH: GAME_WIDTH * DPR,
  GRAVITY: 300,
  CANNON_OFFSET: 100,
};

export const KEYS = {
  PLAYER: "player",
  SCENES: {
    REPLAY: "replayScene",
  },
};

export const ASSET_ENDPOINTS = {
  MISSING: "assets/missing.png",
  MARBLE: "assets/marble.png",
  CIRCLE: "assets/circle.png",
};
