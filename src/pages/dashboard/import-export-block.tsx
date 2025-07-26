import {
  Container,
  Header,
  ColumnLayout,
  Box,
  Textarea,
  Button,
  SpaceBetween,
  Icon,
} from "@cloudscape-design/components";
import React from "react";
import { BlockProps } from "../../common/types";

export default function ImportExportBlock(props: BlockProps) {
  const [importJson, setImportJson] = React.useState("{}");

  return (
    <Container
      header={
        <Header variant="h2">
          <Icon name="file" /> Import/Export Character
        </Header>
      }
    >
      <ColumnLayout columns={2} variant="text-grid">
        <div>
          <SpaceBetween direction="vertical" size="xs">
            <Box variant="awsui-key-label">Import from JSON</Box>
            <Textarea
              onChange={({ detail }) => setImportJson(detail.value)}
              value={importJson}
              placeholder="{}"
            />
            <Button onClick={() => props.setCharacter(JSON.parse(importJson))}>
              Import
            </Button>
          </SpaceBetween>
        </div>
        <div>
          <SpaceBetween direction="vertical" size="xs">
            <Box variant="awsui-key-label">JSON Export</Box>
            <Textarea
              value={JSON.stringify(props.character)}
              placeholder="{}"
            />
          </SpaceBetween>
        </div>
      </ColumnLayout>
    </Container>
  );
}
