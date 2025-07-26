import { DX_SKILL_TABLE, IQ_SKILL_TABLE } from "../constants";
import { Character, Skill, SkillType } from "../types";
import { calcSkillLvl } from "./character-outputs";

// Basic attributes
export const stPoints = (char: Character) => (char.atts.st - 10) * 10;
export const htPoints = (char: Character) => (char.atts.ht - 10) * 10;
export const iqPoints = (char: Character) => (char.atts.iq - 10) * 20;
export const dxPoints = (char: Character) => (char.atts.dx - 10) * 20;

export const attTotalPoints = (char: Character) =>
  stPoints(char) + htPoints(char) + iqPoints(char) + dxPoints(char);

// Secondary attributes
export const dmgModPoints = (_char: Character) => 0;
export const hpModPoints = (char: Character) => {
  const hpMod = char.attMods.hpMod;
  const sizeMod = char.attMods.sizeMod;

  let discount = 0;
  if (sizeMod >= 1 && sizeMod <= 8) {
    discount = 0.1 * sizeMod;
  } else if (sizeMod > 8) {
    discount = 0.8;
  }

  return Math.floor((1.0 - discount) * (hpMod * 2));
};
export const willModPoints = (char: Character) => char.attMods.willMod * 5;
export const perModPoints = (char: Character) => char.attMods.perMod * 5;
export const speedModPoints = (char: Character) => char.attMods.speedMod * 20;
export const moveModPoints = (char: Character) => char.attMods.moveMod * 5;

export const attModTotalPoints = (char: Character) =>
  dmgModPoints(char) +
  hpModPoints(char) +
  willModPoints(char) +
  perModPoints(char) +
  speedModPoints(char) +
  moveModPoints(char);

// Advantages, disadvantages, quirks, perks, adjusters
export const advantagesTotalPoints = (char: Character) =>
  char.advantages.reduce((totalPoints, adv) => totalPoints + adv.cost, 0);

// Skills
export const skillPoints = (skill: Skill) => {
  const table = skill.att === "iq" ? IQ_SKILL_TABLE : DX_SKILL_TABLE;

  return table[skill.attMod]
    ? table[skill.attMod][skill.difficulty] // normal level within the table specifications
    : table.linear[skill.difficulty](skill.attMod); // higher level scaling linearly
};

export const skillsTotalPoints = (char: Character) =>
  char.skills.reduce(
    (totalPoints, skill) => totalPoints + skillPoints(skill),
    0,
  );

export const skillEnergyCost = (char: Character, skill: Skill) => {
  const lvl = calcSkillLvl(char, skill);

  if (skill.type === SkillType.SPELL) {
    // Homebrew rule: energy cost decreases with spell level
    // Default energy = 3, then 2 if lvl 15+, then 1 if lvl 20+
    if (lvl < 15) {
      return 3;
    } else if (lvl < 20) {
      return 2;
    } else {
      return 1;
    }
  } else {
    // No energy cost for non-spells
    return 0;
  }
};

// Character
export const charTotalPoints = (char: Character) => {
  if (char) {
    return (
      attTotalPoints(char) +
      attModTotalPoints(char) +
      advantagesTotalPoints(char) +
      skillsTotalPoints(char)
    );
  } else {
    return 0;
  }
};
