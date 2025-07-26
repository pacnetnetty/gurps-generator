import {
  Container,
  Header,
  ColumnLayout,
  Box,
  Input,
  Button,
  Icon,
  Table,
  SpaceBetween,
  Popover,
  StatusIndicator,
} from "@cloudscape-design/components";
import { BlockProps } from "../../common/types";
import { produce } from "immer";
import {
  dxPoints,
  hpModPoints,
  htPoints,
  iqPoints,
  moveModPoints,
  perModPoints,
  speedModPoints,
  stPoints,
  willModPoints,
} from "../../common/helpers/character-points";
import {
  calcDmg,
  calcHp,
  calcMove,
  calcPer,
  calcSpeed,
  calcWill,
} from "../../common/helpers/character-outputs";

export default function AttributesBlock(props: BlockProps) {
  return (
    <Container
      header={
        <Header variant="h2">
          <Icon name="gen-ai" /> Attributes
        </Header>
      }
    >
      <SpaceBetween direction="vertical" size="s">
        <ColumnLayout columns={2} variant="text-grid">
          <ColumnLayout columns={2}>
            <div>
              <Box variant="awsui-key-label">
                ST (Points: {stPoints(props.character)})
              </Box>
              <Input
                onChange={({ detail }) =>
                  props.setCharacter(
                    produce(props.character, (next) => {
                      next.atts.st = Number(detail.value);
                    }),
                  )
                }
                value={`${props.character.atts.st}`}
                type="number"
                placeholder="10"
              />
            </div>
            <div>
              <Box variant="awsui-key-label">
                HT (Points: {htPoints(props.character)})
              </Box>
              <Input
                onChange={({ detail }) =>
                  props.setCharacter(
                    produce(props.character, (next) => {
                      next.atts.ht = Number(detail.value);
                    }),
                  )
                }
                value={`${props.character.atts.ht}`}
                type="number"
                placeholder="10"
              />
            </div>
          </ColumnLayout>
          <ColumnLayout columns={2}>
            <div>
              <Box variant="awsui-key-label">
                DX (Points: {dxPoints(props.character)})
              </Box>
              <Input
                onChange={({ detail }) =>
                  props.setCharacter(
                    produce(props.character, (next) => {
                      next.atts.dx = Number(detail.value);
                    }),
                  )
                }
                value={`${props.character.atts.dx}`}
                type="number"
                placeholder="10"
              />
            </div>
            <div>
              <Box variant="awsui-key-label">
                IQ (Points: {iqPoints(props.character)})
              </Box>
              <Input
                onChange={({ detail }) =>
                  props.setCharacter(
                    produce(props.character, (next) => {
                      next.atts.iq = Number(detail.value);
                    }),
                  )
                }
                value={`${props.character.atts.iq}`}
                type="number"
                placeholder="10"
              />
            </div>
          </ColumnLayout>
        </ColumnLayout>

        <Table
          renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
            `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
          }
          columnDefinitions={[
            {
              id: "name",
              header: "Characteristic",
              cell: (item) => (
                <div>
                  {item.alert ? (
                    <Popover header="Info" content={item.alert}>
                      <StatusIndicator type="info" />
                    </Popover>
                  ) : (
                    <></>
                  )}
                  {item.name}
                </div>
              ),
              isRowHeader: true,
            },
            {
              id: "mod",
              header: "Modifier",
              cell: (item) => (
                <Input
                  onChange={({ detail }) => item.updater(Number(detail.value))}
                  value={`${item.att}`}
                  type="number"
                  placeholder="10"
                />
              ),
            },
            {
              id: "cost",
              header: "Point Cost",
              cell: (item) => (item.cost ? item.cost(props.character) : "-"),
            },
            {
              id: "result",
              header: "Result Value",
              cell: (item) => (item.result ? `${item.result()}` : "-"),
            },
          ]}
          enableKeyboardNavigation
          items={[
            {
              name: "DMG (ST) - Thrust / Swing",
              att: props.character.attMods.dmgMod,
              updater: (val: number) => {
                props.setCharacter(
                  produce(props.character, (next) => {
                    next.attMods.dmgMod = val;
                  }),
                );
              },
              alert:
                "Rule: this cannot be adjusted on its own, which is why the point cost is unaffected.",
              result: () => calcDmg(props.character),
            },
            {
              name: "HP",
              att: props.character.attMods.hpMod,
              updater: (val: number) => {
                props.setCharacter(
                  produce(props.character, (next) => {
                    next.attMods.hpMod = val;
                  }),
                );
              },
              cost: hpModPoints,
              result: () => calcHp(props.character),
            },
            {
              name: "Will",
              att: props.character.attMods.willMod,
              updater: (val: number) => {
                props.setCharacter(
                  produce(props.character, (next) => {
                    next.attMods.willMod = val;
                  }),
                );
              },
              cost: willModPoints,
              result: () => calcWill(props.character),
            },
            {
              name: "Per",
              att: props.character.attMods.perMod,
              updater: (val: number) => {
                props.setCharacter(
                  produce(props.character, (next) => {
                    next.attMods.perMod = val;
                  }),
                );
              },
              cost: perModPoints,
              result: () => calcPer(props.character),
            },
            {
              name: "Basic Speed",
              att: props.character.attMods.speedMod,
              updater: (val: number) => {
                props.setCharacter(
                  produce(props.character, (next) => {
                    next.attMods.speedMod = val;
                  }),
                );
              },
              cost: speedModPoints,
              result: () => calcSpeed(props.character),
            },
            {
              name: "Basic Move",
              att: props.character.attMods.moveMod,
              updater: (val: number) => {
                props.setCharacter(
                  produce(props.character, (next) => {
                    next.attMods.moveMod = val;
                  }),
                );
              },
              cost: moveModPoints,
              result: () => calcMove(props.character),
            },
            {
              name: "Size",
              att: props.character.attMods.sizeMod,
              updater: (val: number) => {
                props.setCharacter(
                  produce(props.character, (next) => {
                    next.attMods.sizeMod = val;
                  }),
                );
              },
              alert:
                "Add point adjustments manually as Adjusters in the Advantages table",
            },
            {
              name: "Magery Bonus",
              att: props.character.attMods.mageryBonus,
              updater: (val: number) => {
                props.setCharacter(
                  produce(props.character, (next) => {
                    next.attMods.mageryBonus = val;
                  }),
                );
              },
              alert:
                "Used for bonuses such as Magical Aptitude that adjust the base skill level of spells",
            },
          ]}
          loadingText="Loading resources"
          sortingDisabled
          empty={
            <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <b>No resources</b>
                <Button>Create resource</Button>
              </SpaceBetween>
            </Box>
          }
          header={<Header> Secondary Characteristics </Header>}
        />
      </SpaceBetween>
    </Container>
  );
}
