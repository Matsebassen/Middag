import "./shopping-list.scss";

import {
  CircularProgress,
  LinearProgress,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import React, { Fragment, Suspense, useEffect, useState } from "react";
import { SHOP_ITEMS_QUERY_KEY, useFetchShopItems } from "../api/shop-items-api";
import { NameId, ShopItem } from "../models/shopItem";
import { ShoppingCategories } from "./shopping-categories";
import { ShoppingItem } from "./shopping-item";
import {
  addIngredient,
  editIngredient,
  getIngredientTypes,
  setIngredientType,
  toggleShopItem,
} from "./shopping-list-service";

export const ShoppingList = () => {
  return (
    <Suspense
      fallback={
        <div>
          <h1>Shopping list</h1>
          <CircularProgress className="shopping-list_loading" size={64} />
        </div>
      }
    >
      <ShoppingListInternal />
    </Suspense>
  );
};

const ShoppingListInternal = () => {
  const queryClient = useQueryClient();
  const [ingredientInput, setIngredientInput] = useState("");
  const [editingIngredient, setEditingIngredient] = useState(0);
  const [category, setCategory] = useState(1);
  const { shopItems } = useFetchShopItems(category);
  const [loading, setLoading] = useState(false);
  const [ingredientTypes, setIngredientTypes] = useState([] as NameId[]);

  const [shopItemMenu, setShopItemMenu] = useState<null | {
    anchorEl: HTMLElement;
    shopItem: ShopItem;
  }>(null);
  const menuOpen = Boolean(shopItemMenu);

  useEffect(() => {
    (async () => {
      const ingredientTypes = await getIngredientTypes();
      setIngredientTypes(ingredientTypes);
    })();
  }, []);

  const onEditIngredient = async (shopItem: ShopItem) => {
    setLoading(true);
    setEditingIngredient(0);
    const modifiedShopItem = await editIngredient(shopItem);
    mutateShopItemAdd(modifiedShopItem);
    setLoading(false);
  };

  const onAddIngredient = async (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (event.key === "Enter") {
      setLoading(true);
      const shopItem = await addIngredient(ingredientInput, category);
      mutateShopItemAdd(shopItem);
      setIngredientInput("");
      setLoading(false);
    }
  };

  const mutateShopItemAdd = (shopItem: ShopItem) => {
    const newShopItems: ShopItem[] = [...shopItems];
    const index = newShopItems.findIndex((item) => item.id === shopItem.id);
    newShopItems[index] = shopItem;
    queryClient.setQueryData([SHOP_ITEMS_QUERY_KEY, category], newShopItems);
  };

  const onToggleHaveBought = async (id: number) => {
    setLoading(true);
    const shopItem = await toggleShopItem(id);
    mutateShopItemAdd(shopItem);
    setLoading(false);
  };

  function handleMenuClose() {
    setShopItemMenu(null);
  }

  const onSetIngredientType = async (ingredientTypeId: number | undefined) => {
    setShopItemMenu(null);
    await setIngredientType(
      shopItemMenu?.shopItem?.ingredient?.id,
      ingredientTypeId
    );
  };

  return (
    <Fragment>
      <Menu
        id="basic-menu"
        anchorEl={shopItemMenu?.anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {ingredientTypes.map((type) => (
          <MenuItem key={type.id} onClick={() => onSetIngredientType(type.id)}>
            {type.name}
          </MenuItem>
        ))}
      </Menu>
      <div className="shopping-list">
        <h1>Shopping list</h1>
        <ShoppingCategories category={category} setCategory={setCategory} />

        <TextField
          className="ingredient-input"
          label="Add item"
          value={ingredientInput}
          onChange={(e) => setIngredientInput(e?.target?.value)}
          onKeyDown={(e) => onAddIngredient(e)}
          variant="outlined"
        />
        {loading && <LinearProgress></LinearProgress>}
        <GroceryList
          ingredients={shopItems}
          haveBought={false}
          editingIngredient={editingIngredient}
          setEditingIngredient={setEditingIngredient}
          onEditIngredient={onEditIngredient}
          toggleHaveBought={onToggleHaveBought}
          openMenu={(event, shopItem) =>
            setShopItemMenu({ anchorEl: event.currentTarget, shopItem })
          }
        />
        <h4>Recently used:</h4>
        <GroceryList
          ingredients={shopItems}
          haveBought={true}
          editingIngredient={editingIngredient}
          setEditingIngredient={setEditingIngredient}
          onEditIngredient={onEditIngredient}
          toggleHaveBought={onToggleHaveBought}
          openMenu={(event, shopItem) =>
            setShopItemMenu({ anchorEl: event.currentTarget, shopItem })
          }
        />
      </div>
    </Fragment>
  );
};

const GroceryList = (props: {
  ingredients: ShopItem[];
  haveBought: boolean;
  editingIngredient: number;
  setEditingIngredient: (id: number) => void;
  toggleHaveBought: (id: number) => void;
  onEditIngredient: (ingredient: ShopItem) => void;
  openMenu: (
    event: React.MouseEvent<HTMLButtonElement>,
    shopItem: ShopItem
  ) => void;
}) => {
  return (
    <div className="grocery-list">
      {props.ingredients &&
        props.ingredients
          .filter((grocery) => !!grocery.recentlyUsed === props.haveBought)
          .sort((a, b) =>
            props.haveBought
              ? b.recentlyUsed - a.recentlyUsed
              : (a.ingredient?.ingredientType?.order ?? 99) -
                (b.ingredient?.ingredientType?.order ?? 99)
          )
          .map((grocery) => (
            <ShoppingItem
              shopItem={grocery}
              key={grocery.id}
              editIngredient={props.onEditIngredient}
              toggleHaveBought={props.toggleHaveBought}
              isEditing={props.editingIngredient === grocery.id}
              setEdit={props.setEditingIngredient}
              openMenu={props.openMenu}
            />
          ))}
    </div>
  );
};
