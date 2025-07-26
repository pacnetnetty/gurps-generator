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
} from "@cloudscape-design/components";
import React, { useEffect } from "react";
import { BlockProps, Factor } from "../../common/types";
import { produce } from "immer";

interface ReactionTableItem extends Factor {
  index: number;
}
interface ReactionEditModalProps {
  visible: boolean;
  handleClose: () => void;
  handleSave: (item: ReactionTableItem) => void;
  item: ReactionTableItem;
}

export default function ReactionsBlock(props: BlockProps) {
  const [selectedItems, setSelectedItems] = React.useState<ReactionTableItem[]>(
    [],
  );
  const [editModalVisible, setEditModalVisble] = React.useState(false);

  const handleCreate = () => {
    // Add default reaction
    props.setCharacter(
      produce(props.character, (next) => {
        next.reactions.push({
          name: `New Reaction ${props.character.reactions.length + 1}`,
          cost: 0,
        });
      }),
    );
  };

  const handleEditOpen = () => {
    // Open edit modal for selected reaction
    if (selectedItems.length == 1) {
      setEditModalVisble(true);
    }
  };

  const handleEditClose = () => {
    setEditModalVisble(false);
    setSelectedItems([]);
  };

  const handleEditSave = (item: ReactionTableItem) => {
    // Save a reaction edited in the edit modal
    handleEditClose();
    props.setCharacter(
      produce(props.character, (next) => {
        const { index, ...data } = item;
        next.reactions[index] = data;
      }),
    );
  };

  const handleDelete = () => {
    // Delete selected reaction
    if (selectedItems.length == 1) {
      props.setCharacter(
        produce(props.character, (next) => {
          next.reactions.splice(selectedItems[0].index, 1);
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
            id: "name",
            header: "Name",
            cell: (e) => e.name,
            isRowHeader: true,
          },
          {
            id: "val",
            header: "Value",
            cell: (e) => `${e.cost}`,
            isRowHeader: true,
          },
        ]}
        enableKeyboardNavigation
        items={props.character.reactions.map((val, index) => ({
          ...val,
          index,
        }))}
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
            <Icon name="star"></Icon> Reactions
          </Header>
        }
      />
      <ReactionEditModal
        visible={editModalVisible}
        handleClose={handleEditClose}
        handleSave={handleEditSave}
        item={selectedItems[0]}
      />
    </div>
  );
}

function ReactionEditModal(props: ReactionEditModalProps) {
  const [editItem, setEditItem] = React.useState<ReactionTableItem>(
    props.item ?? {
      index: -1,
      name: "",
      cost: 0,
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
      header="Edit Reaction"
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
        <FormField label="Value">
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
      </SpaceBetween>
    </Modal>
  );
}
