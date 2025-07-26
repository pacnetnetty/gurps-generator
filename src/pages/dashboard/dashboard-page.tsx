import { APP_NAME } from "../../common/constants";
import {
  BreadcrumbGroup,
  ContentLayout,
  SpaceBetween,
} from "@cloudscape-design/components";
import { useOnFollow } from "../../common/hooks/use-on-follow";
import BaseAppLayout from "../../components/base-app-layout";
import DashboardHeader from "./dashboard-header";
import BasicDetailsBlock from "./basic-details-block";
import ImportExportBlock from "./import-export-block";
import AttributesBlock from "./attributes-block";
import AdvantagesBlock from "./advantages-block";
import ReactionsBlock from "./reactions-block";
import SkillsBlock from "./skills-block";
import MeleeBlock from "./melee-block";
import ItemsBlock from "./items-block";
import ArmorBlock from "./armor-block";
import RangedBlock from "./ranged-block";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { BlockProps } from "../../common/types";

export default function DashboardPage(props: BlockProps) {
  const onFollow = useOnFollow();
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (hash === "") {
      window.scrollTo(0, 0);
    } else {
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView();
        }
      }, 0);
    }
  }, [pathname, hash, key]);

  return (
    <BaseAppLayout
      character={props.character}
      breadcrumbs={
        <BreadcrumbGroup
          onFollow={onFollow}
          items={[
            {
              text: APP_NAME,
              href: "/",
            },
          ]}
        />
      }
      content={
        <ContentLayout header={<DashboardHeader />}>
          <SpaceBetween size="l">
            <div id="import-export-block">
              <ImportExportBlock
                character={props.character}
                setCharacter={props.setCharacter}
              />
            </div>
            <div id="basic-details-block">
              <BasicDetailsBlock
                character={props.character}
                setCharacter={props.setCharacter}
              />
            </div>
            <div id="attributes-block">
              <AttributesBlock
                character={props.character}
                setCharacter={props.setCharacter}
              />
            </div>
            <div id="advantages-block">
              <AdvantagesBlock
                character={props.character}
                setCharacter={props.setCharacter}
              />
            </div>
            <div id="reactions-block">
              <ReactionsBlock
                character={props.character}
                setCharacter={props.setCharacter}
              />
            </div>
            <div id="skills-block">
              <SkillsBlock
                character={props.character}
                setCharacter={props.setCharacter}
              />
            </div>
            <div id="melee-block">
              <MeleeBlock
                character={props.character}
                setCharacter={props.setCharacter}
              />
            </div>
            <div id="ranged-block">
              <RangedBlock />
            </div>
            <div id="items-block">
              <ItemsBlock
                character={props.character}
                setCharacter={props.setCharacter}
              />
            </div>
            <div id="armor-block">
              <ArmorBlock
                character={props.character}
                setCharacter={props.setCharacter}
              />
            </div>
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
