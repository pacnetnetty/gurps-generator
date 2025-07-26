import { Character, SkillDifficulty } from "./types";

export const APP_NAME = "GURPS 3E Homebrew Character Generator";
export const USE_BROWSER_ROUTER = true;

export const DEFAULT_CHARACTER: Character = {
  bio: {
    name: "",
    player: "",
    notes: "",
    appearance: "",
    height: "",
    weight: "",
    age: "",
    unspentPoints: 0,
  },
  atts: {
    st: 10,
    dx: 10,
    iq: 10,
    ht: 10,
  },
  attMods: {
    dmgMod: 0,
    hpMod: 0,
    willMod: 0,
    perMod: 0,
    speedMod: 0,
    moveMod: 0,
    sizeMod: 0,
    mageryBonus: 0,
  },
  advantages: [],
  reactions: [],
  armors: [],
  items: [],
  meleeWeapons: [],
  skills: [],
};

export const DX_SKILL_TABLE: {
  [lvlMod: number]: {
    [diff in SkillDifficulty]: number;
  };
  linear: {
    [diff in SkillDifficulty]: (lvl: number) => number;
  };
} = {
  [-3]: { Easy: 0, Avg: 0, Hard: 0, VeryHard: 1 },
  [-2]: { Easy: 0, Avg: 0, Hard: 1, VeryHard: 2 },
  [-1]: { Easy: 0, Avg: 1, Hard: 2, VeryHard: 4 },
  [0]: { Easy: 1, Avg: 2, Hard: 4, VeryHard: 8 },
  [1]: { Easy: 2, Avg: 4, Hard: 8, VeryHard: 12 },
  [2]: { Easy: 4, Avg: 8, Hard: 12, VeryHard: 16 },
  [3]: { Easy: 8, Avg: 12, Hard: 16, VeryHard: 20 },
  [4]: { Easy: 12, Avg: 16, Hard: 20, VeryHard: 24 },
  [5]: { Easy: 16, Avg: 20, Hard: 24, VeryHard: 28 },
  linear: {
    Easy: (lvl: number) => 4 * (lvl - 1),
    Avg: (lvl: number) => 4 * lvl,
    Hard: (lvl: number) => 4 * (lvl + 1),
    VeryHard: (lvl: number) => 4 * (lvl + 2),
  },
};

export const IQ_SKILL_TABLE = DX_SKILL_TABLE;

export const DAMAGE_TABLE: {
  [st: number]: {
    th: string;
    sw: string;
  };
} = {
  1: { th: "1d-6", sw: "1d-5" },
  2: { th: "1d-6", sw: "1d-5" },
  3: { th: "1d-5", sw: "1d-4" },
  4: { th: "1d-5", sw: "1d-4" },
  5: { th: "1d-4", sw: "1d-3" },
  6: { th: "1d-4", sw: "1d-3" },
  7: { th: "1d-3", sw: "1d-2" },
  8: { th: "1d-3", sw: "1d-2" },
  9: { th: "1d-2", sw: "1d-1" },
  10: { th: "1d-2", sw: "1d" },
  11: { th: "1d-1", sw: "1d+1" },
  12: { th: "1d-1", sw: "1d+2" },
  13: { th: "1d", sw: "2d-1" },
  14: { th: "1d", sw: "2d" },
  15: { th: "1d+1", sw: "2d+1" },
  16: { th: "1d+1", sw: "2d+2" },
  17: { th: "1d+2", sw: "3d-1" },
  18: { th: "1d+2", sw: "3d" },
  19: { th: "2d-1", sw: "3d+1" },
  20: { th: "2d-1", sw: "3d+2" },
  21: { th: "2d", sw: "4d-1" },
  22: { th: "2d", sw: "4d" },
  23: { th: "2d+1", sw: "4d+1" },
  24: { th: "2d+1", sw: "4d+2" },
  25: { th: "2d+2", sw: "5d-1" },
  26: { th: "2d+2", sw: "5d" },
  27: { th: "3d-1", sw: "5d+1" },
  28: { th: "3d-1", sw: "5d+1" },
  29: { th: "3d", sw: "5d+2" },
  30: { th: "3d", sw: "5d+2" },
  31: { th: "3d+1", sw: "6d-1" },
  32: { th: "3d+1", sw: "6d-1" },
  33: { th: "3d+2", sw: "6d" },
  34: { th: "3d+2", sw: "6d" },
  35: { th: "4d-1", sw: "6d+1" },
  36: { th: "4d-1", sw: "6d+1" },
  37: { th: "4d", sw: "6d+2" },
  38: { th: "4d", sw: "6d+2" },
  39: { th: "4d+1", sw: "7d-1" },
  40: { th: "4d+1", sw: "7d-1" },
  45: { th: "5d", sw: "7d+1" },
  50: { th: "5d+2", sw: "8d-1" },
  55: { th: "6d", sw: "8d+1" },
  60: { th: "7d-1", sw: "9d" },
  65: { th: "7d+1", sw: "9d+2" },
  70: { th: "8d", sw: "10d" },
  75: { th: "8d+2", sw: "10d+2" },
  80: { th: "9d", sw: "11d" },
  85: { th: "9d+2", sw: "11d+2" },
  90: { th: "10d", sw: "12d" },
  95: { th: "10d+2", sw: "12d+2" },
  100: { th: "11d", sw: "13d" },
};
