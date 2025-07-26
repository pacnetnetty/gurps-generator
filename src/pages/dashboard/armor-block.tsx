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
  Multiselect,
} from "@cloudscape-design/components";
import React, { useEffect } from "react";
import { Armor, ArmorPiece, BlockProps } from "../../common/types";
import { produce } from "immer";

interface ArmorTableItem extends Armor {
  index: number;
}
interface ArmorEditModalProps {
  visible: boolean;
  handleClose: () => void;
  handleSave: (item: ArmorTableItem) => void;
  item: ArmorTableItem;
}

export default function ArmorBlock(props: BlockProps) {
  const [selectedItems, setSelectedItems] = React.useState<ArmorTableItem[]>(
    [],
  );
  const [editModalVisible, setEditModalVisble] = React.useState(false);

  const handleCreate = () => {
    // Add default armor
    props.setCharacter(
      produce(props.character, (next) => {
        next.armors.push({
          name: `New Armor ${props.character.armors.length + 1}`,
          cost: 0,
          dr: 0,
          locations: [],
        });
      }),
    );
  };

  const handleEditOpen = () => {
    // Open edit modal for selected armor
    if (selectedItems.length == 1) {
      setEditModalVisble(true);
    }
  };

  const handleEditClose = () => {
    setEditModalVisble(false);
    setSelectedItems([]);
  };

  const handleEditSave = (item: ArmorTableItem) => {
    // Save an armor edited in the edit modal
    handleEditClose();
    props.setCharacter(
      produce(props.character, (next) => {
        const { index, ...data } = item;
        next.armors[index] = data;
      }),
    );
  };

  const handleDelete = () => {
    // Delete selected armor
    if (selectedItems.length == 1) {
      props.setCharacter(
        produce(props.character, (next) => {
          next.armors.splice(selectedItems[0].index, 1);
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
            id: "locs",
            header: "Locations",
            cell: (e) => `${e.locations.join(", ")}`,
          },
          {
            id: "cost",
            header: "$",
            cell: (e) => `${e.cost}`,
          },
          {
            id: "dr",
            header: "DR",
            cell: (e) => `${e.dr}`,
          },
          {
            id: "notes",
            header: "Notes",
            cell: (e) => e.notes,
          },
        ]}
        enableKeyboardNavigation
        items={props.character.armors.map((val, index) => ({ ...val, index }))}
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
            <Icon name="treeview-expand"></Icon> Armor and Shields
          </Header>
        }
      />

      <ArmorEditModal
        visible={editModalVisible}
        handleClose={handleEditClose}
        handleSave={handleEditSave}
        item={selectedItems[0]}
      />
    </div>
  );
}

function ArmorEditModal(props: ArmorEditModalProps) {
  const PIECE_OPTIONS = Object.values(ArmorPiece).map((name) => ({
    label: name,
    value: name,
  }));

  const [editItem, setEditItem] = React.useState<ArmorTableItem>(
    props.item ?? {
      index: -1,
      name: "",
      dr: 0,
      locations: [],
      cost: 0,
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
      header="Edit Armor"
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
        <FormField label="DR">
          <Input
            value={`${editItem.dr}`}
            type="number"
            onChange={({ detail }) =>
              setEditItem({
                ...editItem,
                dr: Number(detail.value),
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
        <FormField label="Locations">
          <Multiselect
            selectedOptions={editItem.locations.map((loc) => ({
              label: loc,
              value: loc,
            }))}
            onChange={({ detail }) =>
              setEditItem({
                ...editItem,
                locations: detail.selectedOptions.map(
                  (opt) => opt.value as ArmorPiece,
                ),
              })
            }
            options={PIECE_OPTIONS}
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
