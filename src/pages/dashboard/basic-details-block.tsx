import {
  Container,
  Header,
  ColumnLayout,
  Box,
  Input,
  Textarea,
  Icon,
} from "@cloudscape-design/components";
import { BlockProps } from "../../common/types";
import { produce } from "immer";

export default function BasicDetailsBlock(props: BlockProps) {
  return (
    <Container
      header={
        <Header variant="h2">
          <Icon name="user-profile" /> Basic Details
        </Header>
      }
    >
      <ColumnLayout columns={2} variant="text-grid">
        <div>
          <Box variant="awsui-key-label">Unspent Points</Box>
          <Input
            onChange={({ detail }) =>
              props.setCharacter(
                produce(props.character, (next) => {
                  next.bio.unspentPoints = Number(detail.value);
                }),
              )
            }
            type="number"
            value={`${props.character.bio.unspentPoints}`}
            placeholder="0"
          />
        </div>
        <div>
          <Box variant="awsui-key-label">Age</Box>
          <Input
            onChange={({ detail }) =>
              props.setCharacter(
                produce(props.character, (next) => {
                  next.bio.age = detail.value;
                }),
              )
            }
            value={props.character.bio.age}
            placeholder="20"
          />
        </div>
        <ColumnLayout columns={2}>
          <div>
            <Box variant="awsui-key-label">Name</Box>
            <Input
              onChange={({ detail }) =>
                props.setCharacter(
                  produce(props.character, (next) => {
                    next.bio.name = detail.value;
                  }),
                )
              }
              value={props.character.bio.name}
              placeholder="Hendrix"
            />
          </div>
          <div>
            <Box variant="awsui-key-label">Player</Box>
            <Input
              onChange={({ detail }) =>
                props.setCharacter(
                  produce(props.character, (next) => {
                    next.bio.player = detail.value;
                  }),
                )
              }
              value={props.character.bio.player}
              placeholder="Yosef Rombi"
            />
          </div>
        </ColumnLayout>
        <ColumnLayout columns={2}>
          <div>
            <Box variant="awsui-key-label">Height</Box>
            <Input
              onChange={({ detail }) =>
                props.setCharacter(
                  produce(props.character, (next) => {
                    next.bio.height = detail.value;
                  }),
                )
              }
              value={props.character.bio.height}
              placeholder="8ft 0in"
            />
          </div>
          <div>
            <Box variant="awsui-key-label">Weight</Box>
            <Input
              onChange={({ detail }) =>
                props.setCharacter(
                  produce(props.character, (next) => {
                    next.bio.weight = detail.value;
                  }),
                )
              }
              value={props.character.bio.weight}
              placeholder="300 lb"
            />
          </div>
        </ColumnLayout>
        <div>
          <Box variant="awsui-key-label">Appearance</Box>
          <Textarea
            onChange={({ detail }) =>
              props.setCharacter(
                produce(props.character, (next) => {
                  next.bio.appearance = detail.value;
                }),
              )
            }
            value={props.character.bio.appearance}
            placeholder="Tall person"
          />
        </div>
        <div>
          <Box variant="awsui-key-label">Notes</Box>
          <Textarea
            onChange={({ detail }) =>
              props.setCharacter(
                produce(props.character, (next) => {
                  next.bio.notes = detail.value;
                }),
              )
            }
            value={props.character.bio.notes}
            placeholder="Additional info"
          />
        </div>
      </ColumnLayout>
    </Container>
  );
}
