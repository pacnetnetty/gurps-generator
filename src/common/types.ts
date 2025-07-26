export interface NavigationPanelState {
  collapsed?: boolean;
  collapsedSections?: Record<number, boolean>;
}

export interface Factor {
  name: string;
  cost: number;
  notes?: string;
}

// Includes shields in this homebrew as a straight DR item
export interface Armor extends Factor {
  dr: number;
  locations: ArmorPiece[];
}

export interface Item extends Factor {
  qty: number;
}

export interface Advantage extends Factor {
  type: AdvantageType;
}

export interface MeleeWeapon extends Factor {
  dmgType: string;
  dmgAmt: string;
  reach: string;
  lvl: number;
  qty: number;
  parry: string;
}

export interface Skill extends Omit<Factor, "cost"> {
  // point cost is calculated for skills, not user input
  type: SkillType;
  att: Att;
  attMod: number; // affects point cost
  otherMod: number; // does not affect point cost
  difficulty: SkillDifficulty;
}

export enum ArmorPiece {
  ALL = "All",
  HEAD = "Head",
  BODY = "Body",
  ARMS = "Arms",
  LEGS = "Legs",
  HANDS = "Hands",
  FEET = "Feet",
}

export enum AdvantageType {
  ADVANTAGE = "Advantage",
  PERK = "Perk",
  QUIRK = "Quirk",
  DISADVANTAGE = "Disadvantage",
  ADJUSTER = "Adjuster", // for correcting values outside of the assumptions of this program
}

export enum SkillType {
  SKILL = "Skill",
  SPELL = "Spell",
}

export enum SkillDifficulty {
  EASY = "Easy",
  AVERAGE = "Avg",
  HARD = "Hard",
  VERY_HARD = "VeryHard",
}

export interface Character {
  bio: {
    name: string;
    player: string;
    notes: string;
    appearance: string;
    height: string;
    weight: string;
    age: string;
    unspentPoints: number;
  };
  atts: {
    st: number;
    dx: number;
    iq: number;
    ht: number;
  };
  attMods: {
    dmgMod: number;
    hpMod: number;
    willMod: number;
    perMod: number;
    speedMod: number;
    moveMod: number;
    sizeMod: number;
    mageryBonus: number;
  };
  advantages: Advantage[];
  reactions: Factor[];
  armors: Armor[];
  items: Item[];
  meleeWeapons: MeleeWeapon[];
  skills: Skill[];
}

export type Att = keyof Character["atts"];

export interface BlockProps {
  character: Character;
  setCharacter: React.Dispatch<React.SetStateAction<Character>>;
}
