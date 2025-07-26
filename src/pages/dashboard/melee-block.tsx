import {
  Header,
  Box,
  Input,
  Button,
  Icon,
  Table,
  SpaceBetween,
  FormField,
  Modal,
} from "@cloudscape-design/components";
import React, { useEffect } from "react";
import { BlockProps, MeleeWeapon } from "../../common/types";
import { produce } from "immer";

interface MeleeTableItem extends MeleeWeapon {
  index: number;
}
interface MeleeEditModalProps {
  visible: boolean;
  handleClose: () => void;
  handleSave: (item: MeleeTableItem) => void;
  item: MeleeTableItem;
}

export default function MeleeBlock(props: BlockProps) {
  const [selectedItems, setSelectedItems] = React.useState<MeleeTableItem[]>(
    [],
  );
  const [editModalVisible, setEditModalVisble] = React.useState(false);

  const handleCreate = () => {
    // Add default melee weapon
    props.setCharacter(
      produce(props.character, (next) => {
        next.meleeWeapons.push({
          name: `New Melee Weapon ${props.character.meleeWeapons.length + 1}`,
          cost: 0,
          dmgType: "cr",
          dmgAmt: "1d-4",
          reach: "C,1",
          lvl: 0,
          qty: 0,
          parry: "",
        });
      }),
    );
  };

  const handleEditOpen = () => {
    // Open edit modal for selected melee weapon
    if (selectedItems.length == 1) {
      setEditModalVisble(true);
    }
  };

  const handleEditClose = () => {
    setEditModalVisble(false);
    setSelectedItems([]);
  };

  const handleEditSave = (item: MeleeTableItem) => {
    // Save a melee weapon edited in the edit modal
    handleEditClose();
    props.setCharacter(
      produce(props.character, (next) => {
        const { index, ...data } = item;
        next.meleeWeapons[index] = data;
      }),
    );
  };

  const handleDelete = () => {
    // Delete selected melee weapons
    if (selectedItems.length == 1) {
      props.setCharacter(
        produce(props.character, (next) => {
          next.meleeWeapons.splice(selectedItems[0].index, 1);
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
            id: "type",
            header: "Dmg Type",
            cell: (e) => e.dmgType,
            isRowHeader: true,
          },
          {
            id: "dmg",
            header: "Final Dmg Amount",
            cell: (e) => e.dmgAmt,
          },
          {
            id: "reach",
            header: "Reach",
            cell: (e) => e.reach,
          },
          {
            id: "lvl",
            header: "Effective Lvl (Roll)",
            cell: (e) => `${e.lvl}`,
          },
          {
            id: "qty",
            header: "Qty",
            cell: (e) => `${e.qty}`,
          },
          {
            id: "parry",
            header: "Parry",
            cell: (e) => `${e.parry}`,
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
        items={props.character.meleeWeapons.map((val, index) => ({
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
            <Icon name="flag"></Icon> Melee Weapons
          </Header>
        }
      />

      <MeleeEditModal
        visible={editModalVisible}
        handleClose={handleEditClose}
        handleSave={handleEditSave}
        item={selectedItems[0]}
      />
    </div>
  );
}

function MeleeEditModal(props: MeleeEditModalProps) {
  const [editItem, setEditItem] = React.useState<MeleeTableItem>(
    props.item ?? {
      index: -1,
      name: "",
      dmgType: "",
      dmgAmt: "",
      reach: "",
      lvl: 0,
      qty: 0,
      parry: "",
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
      header="Edit Melee Weapon"
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
        <FormField label="Damage Type">
          <Input
            value={editItem.dmgType}
            onChange={({ detail }) =>
              setEditItem({
                ...editItem,
                dmgType: detail.value,
              })
            }
          />
        </FormField>
        <FormField label="Damage Amount">
          <Input
            value={editItem.dmgAmt}
            onChange={({ detail }) =>
              setEditItem({
                ...editItem,
                dmgAmt: detail.value,
              })
            }
          />
        </FormField>
        <FormField label="Reach">
          <Input
            value={editItem.reach}
            onChange={({ detail }) =>
              setEditItem({
                ...editItem,
                reach: detail.value,
              })
            }
          />
        </FormField>
        <FormField label="Parry">
          <Input
            value={editItem.parry}
            onChange={({ detail }) =>
              setEditItem({
                ...editItem,
                parry: detail.value,
              })
            }
          />
        </FormField>
        <FormField label="Effective Level">
          <Input
            value={`${editItem.lvl}`}
            type="number"
            onChange={({ detail }) =>
              setEditItem({
                ...editItem,
                lvl: Number(detail.value),
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
