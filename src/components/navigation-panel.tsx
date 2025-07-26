import { Button, SideNavigation } from "@cloudscape-design/components";
import { useOnFollow } from "../common/hooks/use-on-follow";
import { useLocation } from "react-router-dom";
import { Character } from "../common/types";
import {
  advantagesTotalPoints,
  attModTotalPoints,
  attTotalPoints,
  charTotalPoints,
  skillsTotalPoints,
} from "../common/helpers/character-points";
import { getCharacterSheetHTML } from "../common/helpers/character-sheet";

interface NavigationPanelProps {
  character: Character;
}

export default function NavigationPanel(props: NavigationPanelProps) {
  const location = useLocation();
  const onFollow = useOnFollow();

  const downloadHTML = () => {
    const element = document.createElement("a");
    const file = new Blob([getCharacterSheetHTML(props.character)], {
      type: "text/html",
    });
    element.href = URL.createObjectURL(file);
    element.download = `GURPS-${props.character.bio.name}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <SideNavigation
      onFollow={onFollow}
      header={{
        href: "/",
        text: `Total Points: ${charTotalPoints(props.character)}`,
      }}
      activeHref={location.pathname}
      items={[
        {
          type: "section",
          text: "Character Creator",
          items: [
            {
              type: "link",
              text: "Import/Export Character",
              href: "/#import-export-block",
            },
            {
              type: "link",
              text: "Basic Details",
              href: "/#basic-details-block",
            },
            {
              type: "link",
              text: `[${attTotalPoints(props.character) + attModTotalPoints(props.character)}] Attributes`,
              href: "/#attributes-block",
            },
            {
              type: "link",
              text: `[${advantagesTotalPoints(props.character)}] Advantages, Disadvantages, Perks, Quirks`,
              href: "/#advantages-block",
            },
            { type: "link", text: "Reactions", href: "/#reactions-block" },
            {
              type: "link",
              text: `[${skillsTotalPoints(props.character)}] Skills and Spells`,
              href: "/#skills-block",
            },
            { type: "link", text: "Melee Weapons", href: "/#melee-block" },
            { type: "link", text: "Ranged Weapons", href: "/#ranged-block" },
            { type: "link", text: "Items", href: "/#items-block" },
            { type: "link", text: "Armor and Shields", href: "/#armor-block" },
          ],
        },
        {
          type: "section",
          text: "Character Sheet",
          items: [
            {
              type: "link",
              text: "",
              href: "/sheet",
              info: (
                <Button onClick={() => downloadHTML()}>Download HTML</Button>
              ),
            },
          ],
        },
      ]}
    />
  );
}
