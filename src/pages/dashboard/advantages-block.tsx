import {
  Header,
  Box,
  Input,
  Button,
  Icon,
  Table,
  SpaceBetween,
  Modal,
  Select,
  FormField,
} from "@cloudscape-design/components";
import React, { useEffect } from "react";
import { Advantage, AdvantageType, BlockProps } from "../../common/types";
import { produce } from "immer";

interface AdvantageTableItem extends Advantage {
  index: number;
}
interface AdvantageEditModalProps {
  visible: boolean;
  handleClose: () => void;
  handleSave: (item: AdvantageTableItem) => void;
  item: AdvantageTableItem;
}

export default function AdvantagesBlock(props: BlockProps) {
  const [selectedItems, setSelectedItems] = React.useState<
    AdvantageTableItem[]
  >([]);
  const [editModalVisible, setEditModalVisble] = React.useState(false);

  const handleCreate = () => {
    // Add default advantage
    props.setCharacter(
      produce(props.character, (next) => {
        next.advantages.push({
          name: `New Factor ${props.character.advantages.length + 1}`,
          type: AdvantageType.ADVANTAGE,
          cost: 0,
        });
      }),
    );
  };

  const handleEditOpen = () => {
    // Open edit modal for selected advantage
    if (selectedItems.length == 1) {
      setEditModalVisble(true);
    }
  };

  const handleEditClose = () => {
    setEditModalVisble(false);
    setSelectedItems([]);
  };

  const handleEditSave = (item: AdvantageTableItem) => {
    // Save an advantage edited in the edit modal
    handleEditClose();
    props.setCharacter(
      produce(props.character, (next) => {
        const { index, ...data } = item;
        next.advantages[index] = data;
      }),
    );
  };

  const handleDelete = () => {
    // Delete selected advantage
    if (selectedItems.length == 1) {
      props.setCharacter(
        produce(props.character, (next) => {
          next.advantages.splice(selectedItems[0].index, 1);
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
            id: "cost",
            header: "Point Cost",
            cell: (e) => `${e.cost}`,
          },
          {
            id: "description",
            header: "Description",
            cell: (e) => e.notes ?? "-",
          },
        ]}
        enableKeyboardNavigation
        items={props.character.advantages.map((val, index) => ({
          ...val,
          index,
        }))}
        loadingText="Loading resources"
        selectionType="single"
        trackBy="index"
        empty={
          <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
            <b>No resources</b>
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
            <Icon name="caret-up-filled"></Icon>
            <Icon name="caret-down-filled"></Icon> Advantages, Disadvantages,
            Perks, Quirks
          </Header>
        }
      />

      <AdvantageEditModal
        visible={editModalVisible}
        handleClose={handleEditClose}
        handleSave={handleEditSave}
        item={selectedItems[0]}
      />
    </div>
  );
}

function AdvantageEditModal(props: AdvantageEditModalProps) {
  const TYPE_OPTIONS = Object.values(AdvantageType).map((name) => ({
    label: name,
    value: name,
  }));

  const [editItem, setEditItem] = React.useState<AdvantageTableItem>({
    index: -1,
    name: "",
    cost: 0,
    notes: "",
    type: AdvantageType.ADVANTAGE,
  });

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
      header="Edit Factor"
    >
      <SpaceBetween direction="vertical" size="s">
        <FormField label="Type">
          <Select
            selectedOption={{ label: editItem.type, value: editItem.type }}
            onChange={({ detail }) =>
              setEditItem({
                ...editItem,
                type: detail.selectedOption.value as AdvantageType,
              })
            }
            options={TYPE_OPTIONS}
          />
        </FormField>
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
        <FormField label="Cost">
          <Input
            value={`${editItem.cost}`}
            type="number"
            onChange={({ detail }) =>
              setEditItem({
                ...editItem,
                cost: Number(detail.value),
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
