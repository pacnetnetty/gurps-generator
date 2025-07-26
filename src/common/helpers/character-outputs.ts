import { DAMAGE_TABLE } from "../constants";
import { Character, Skill, SkillType } from "../types";

// Secondary attributes
export const calcDmg = (char: Character) => {
  const st = char.atts.st + char.attMods.dmgMod;
  const dmg = DAMAGE_TABLE[st] ?? { th: "NA", sw: "NA" };

  return `${dmg.th} / ${dmg.sw}`;
};
export const calcHp = (char: Character) => char.atts.st + char.attMods.hpMod;
export const calcWill = (char: Character) =>
  char.atts.iq + char.attMods.willMod;
export const calcPer = (char: Character) => char.atts.iq + char.attMods.perMod;
export const calcSpeed = (char: Character) =>
  (char.atts.ht + char.atts.dx) / 4 + char.attMods.speedMod;
export const calcMove = (char: Character) =>
  Math.floor(calcSpeed(char)) + char.attMods.moveMod;

// Factors
export const calcSkillLvl = (char: Character, skill: Skill) => {
  const mageryBonus =
    skill.type === SkillType.SPELL ? char.attMods.mageryBonus : 0;
  return char.atts[skill.att] + skill.attMod + skill.otherMod + mageryBonus;
};
