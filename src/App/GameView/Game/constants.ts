const DPR = 1;
const GAME_WIDTH = 400;
const HEIGHT_RATIO = 1.5;

export const GAME = {
  HEIGHT: GAME_WIDTH * DPR * HEIGHT_RATIO,
  WIDTH: GAME_WIDTH * DPR,
  GRAVITY: 300,
  CANNON_OFFSET: 50,
  PEG_RADIUS: 16,
  PLAYER_RADIUS: 16,
  CANNON_STRENGTH: 10,
  SPEED_RESET_THRESHOLD: 0.01,
};

export const KEYS = {
  PLAYER: "player",
  SCENES: {
    REPLAY: "replayScene",
    READY: "readyScene",
  },
};

export const EVENTS = {
  POINTER_DOWN: "pointerdown",
  SLEEP_START: "sleepstart",
};
