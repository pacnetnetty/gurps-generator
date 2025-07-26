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
import { BlockProps, Item } from "../../common/types";
import { produce } from "immer";

interface ItemTableItem extends Item {
  index: number;
}
interface ItemEditModalProps {
  visible: boolean;
  handleClose: () => void;
  handleSave: (item: ItemTableItem) => void;
  item: ItemTableItem;
}

export default function ItemsBlock(props: BlockProps) {
  const [selectedItems, setSelectedItems] = React.useState<ItemTableItem[]>([]);
  const [editModalVisible, setEditModalVisble] = React.useState(false);

  const handleCreate = () => {
    // Add default item
    props.setCharacter(
      produce(props.character, (next) => {
        next.items.push({
          name: `New Item ${props.character.items.length + 1}`,
          cost: 0,
          qty: 0,
        });
      }),
    );
  };

  const handleEditOpen = () => {
    // Open edit modal for selected item
    if (selectedItems.length == 1) {
      setEditModalVisble(true);
    }
  };

  const handleEditClose = () => {
    setEditModalVisble(false);
    setSelectedItems([]);
  };

  const handleEditSave = (item: ItemTableItem) => {
    // Save an item edited in the edit modal
    handleEditClose();
    props.setCharacter(
      produce(props.character, (next) => {
        const { index, ...data } = item;
        next.items[index] = data;
      }),
    );
  };

  const handleDelete = () => {
    // Delete selected item
    if (selectedItems.length == 1) {
      props.setCharacter(
        produce(props.character, (next) => {
          next.items.splice(selectedItems[0].index, 1);
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
          },
          {
            id: "qty",
            header: "Qty",
            cell: (e) => e.qty,
            isRowHeader: true,
          },
          {
            id: "cost",
            header: "$",
            cell: (e) => `${e.cost}`,
          },
          {
            id: "notes",
            header: "Notes",
            cell: (e) => e.notes,
          },
        ]}
        enableKeyboardNavigation
        items={props.character.items.map((val, index) => ({ ...val, index }))}
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
            <Icon name="keyboard"></Icon> Items
          </Header>
        }
      />

      <ItemEditModal
        visible={editModalVisible}
        handleClose={handleEditClose}
        handleSave={handleEditSave}
        item={selectedItems[0]}
      />
    </div>
  );
}

function ItemEditModal(props: ItemEditModalProps) {
  const [editItem, setEditItem] = React.useState<ItemTableItem>(
    props.item ?? {
      index: -1,
      name: "",
      cost: 0,
      qty: 0,
      notes: "",
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
      header="Edit Item"
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
        <FormField label="Quantity">
          <Input
            value={`${editItem.qty}`}
            type="number"
            onChange={({ detail }) =>
              setEditItem({
                ...editItem,
                qty: Number(detail.value),
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
