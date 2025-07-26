import {
  Header,
  Box,
  Input,
  Button,
  Icon,
  Table,
  SpaceBetween,
  Modal,
  FormField,
  Select,
} from "@cloudscape-design/components";
import React, { useEffect } from "react";
import {
  BlockProps,
  Skill,
  SkillDifficulty,
  SkillType,
  Att,
} from "../../common/types";
import { produce } from "immer";
import { calcSkillLvl } from "../../common/helpers/character-outputs";
import {
  skillEnergyCost,
  skillPoints,
} from "../../common/helpers/character-points";

interface SkillTableItem extends Skill {
  index: number;
}
interface SkillEditModalProps {
  visible: boolean;
  handleClose: () => void;
  handleSave: (item: SkillTableItem) => void;
  item: SkillTableItem;
}

export default function SkillsBlock(props: BlockProps) {
  const [selectedItems, setSelectedItems] = React.useState<SkillTableItem[]>(
    [],
  );
  const [editModalVisible, setEditModalVisble] = React.useState(false);

  const handleCreate = () => {
    // Add default skill
    props.setCharacter(
      produce(props.character, (next) => {
        next.skills.push({
          name: `New Skill ${props.character.skills.length + 1}`,
          type: SkillType.SKILL,
          att: "dx",
          attMod: 0,
          otherMod: 0,
          difficulty: SkillDifficulty.AVERAGE,
        });
      }),
    );
  };

  const handleEditOpen = () => {
    // Open edit modal for skill
    if (selectedItems.length == 1) {
      setEditModalVisble(true);
    }
  };

  const handleEditClose = () => {
    setEditModalVisble(false);
    setSelectedItems([]);
  };

  const handleEditSave = (item: SkillTableItem) => {
    // Save a skill edited in the edit modal
    handleEditClose();
    props.setCharacter(
      produce(props.character, (next) => {
        const { index, ...data } = item;
        next.skills[index] = data;
      }),
    );
  };

  const handleDelete = () => {
    // Delete selected skill
    if (selectedItems.length == 1) {
      props.setCharacter(
        produce(props.character, (next) => {
          next.skills.splice(selectedItems[0].index, 1);
        }),
      );
    }
  };

  return (
    <div>
      <Table
        renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
          `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
        }
        onSelectionChange={({ detail }) => {
          setSelectedItems(detail.selectedItems);
          console.log(detail.selectedItems);
        }}
        selectedItems={selectedItems}
        ariaLabels={{
          selectionGroupLabel: "Items selection",
          allItemsSelectionLabel: () => "select all",
          itemSelectionLabel: (_, item) => item.name,
        }}
        resizableColumns={true}
        columnDefinitions={[
          {
            id: "type",
            header: "Type",
            cell: (e) => e.type,
            isRowHeader: true,
          },
          {
            id: "name",
            header: "Name",
            cell: (e) => e.name,
          },
          {
            id: "adj",
            header: "Skill Lvl",
            cell: (e) => `${e.att.toUpperCase()}+${e.attMod}`,
          },
          {
            id: "lvl",
            header: "Effective Lvl (Roll)",
            cell: (e) => `${calcSkillLvl(props.character, e)}`,
          },
          {
            id: "cost",
            header: "Point Cost",
            cell: (e) => `${skillPoints(e)}`,
          },
          {
            id: "enery",
            header: "Energy Cost",
            cell: (e) =>
              e.type === SkillType.SPELL
                ? `${skillEnergyCost(props.character, e)}`
                : "-",
          },
          {
            id: "description",
            header: "Description",
            cell: (e) => e.notes ?? "-",
          },
        ]}
        enableKeyboardNavigation
        items={props.character.skills.map((val, index) => ({ ...val, index }))}
        loadingText="Loading resources"
        selectionType="single"
        trackBy="index"
        empty={
          <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
            <SpaceBetween size="m">
              <b>No resources</b>
            </SpaceBetween>
          </Box>
        }
        header={
          <Header
            actions={
              <SpaceBetween direction="horizontal" size="m">
                <Button variant="primary" onClick={() => handleCreate()}>
                  Create
                </Button>
                <Button onClick={() => handleEditOpen()}>Edit</Button>
                <Button onClick={() => handleDelete()}>Delete</Button>
              </SpaceBetween>
            }
          >
            <Icon name="suggestions"></Icon> Skills and Spells
          </Header>
        }
      />

      <SkillEditModal
        visible={editModalVisible}
        handleClose={handleEditClose}
        handleSave={handleEditSave}
        item={selectedItems[0]}
      />
    </div>
  );
}

function SkillEditModal(props: SkillEditModalProps) {
  const TYPE_OPTIONS = Object.values(SkillType).map((name) => ({
    label: name,
    value: name,
  }));
  const ATT_OPTIONS = ["dx", "iq", "st", "ht"].map((name) => ({
    label: name,
    value: name,
  }));
  const DIFF_OPTIONS = Object.values(SkillDifficulty).map((name) => ({
    label: name,
    value: name,
  }));

  const [editItem, setEditItem] = React.useState<SkillTableItem>(
    props.item ?? {
      index: -1,
      name: "",
      type: SkillType.SKILL,
      att: "dx",
      attMod: 0,
      otherMod: 0,
      difficulty: SkillDifficulty.AVERAGE,
    },
  );

  useEffect(() => {
    if (props.item) {
      setEditItem(props.item);
    }
  }, [props.item]);

  return (
    <Modal
      onDismiss={() => props.handleClose()}
      visible={props.visible}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={() => props.handleClose()}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => props.handleSave(editItem)}
            >
              Save
            </Button>
          </SpaceBetween>
        </Box>
      }
      header="Edit Skill"
    >
      <SpaceBetween direction="vertical" size="s">
        <FormField label="Name">
          <Input
            value={editItem.name}
            onChange={({ detail }) =>
              setEditItem({
                ...editItem,
                name: detail.value,
              })
            }
          />
        </FormField>
        <FormField label="Type">
          <Select
            selectedOption={{ label: editItem.type, value: editItem.type }}
            onChange={({ detail }) =>
              setEditItem({
                ...editItem,
                type: detail.selectedOption.value as SkillType,
              })
            }
            options={TYPE_OPTIONS}
          />
        </FormField>
        <FormField label="Attribute">
          <Select
            selectedOption={{ label: editItem.att, value: editItem.att }}
            onChange={({ detail }) =>
              setEditItem({
                ...editItem,
                att: detail.selectedOption.value as Att,
              })
            }
            options={ATT_OPTIONS}
          />
        </FormField>
        <FormField label="Difficulty">
          <Select
            selectedOption={{
              label: editItem.difficulty,
              value: editItem.difficulty,
            }}
            onChange={({ detail }) =>
              setEditItem({
                ...editItem,
                difficulty: detail.selectedOption.value as SkillDifficulty,
              })
            }
            options={DIFF_OPTIONS}
          />
        </FormField>
        <FormField label="Att Mod">
          <Input
            value={`${editItem.attMod}`}
            type="number"
            onChange={({ detail }) =>
              setEditItem({
                ...editItem,
                attMod: Number(detail.value),
              })
            }
          />
        </FormField>
        <FormField label="Other (Free) Adjustment">
          <Input
            value={`${editItem.otherMod}`}
            type="number"
            onChange={({ detail }) =>
              setEditItem({
                ...editItem,
                otherMod: Number(detail.value),
              })
            }
          />
        </FormField>
        <FormField label="Description">
          <Input
            value={editItem.notes ?? ""}
            onChange={({ detail }) =>
              setEditItem({
                ...editItem,
                notes: detail.value,
              })
            }
          />
        </FormField>
      </SpaceBetween>
    </Modal>
  );
}
