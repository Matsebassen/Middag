import "./shopping-list.scss";

import {
  CircularProgress,
  LinearProgress,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import React, {
  Fragment,
  Suspense,
  useEffect,
  useCallback,
  useState,
} from "react";
import { SHOP_ITEMS_QUERY_KEY, useFetchShopItems, useGetIngredientTypes } from "../api/shop-items-api";
import { useSignalR } from "../hooks/useSignalR";
import { ShopItem } from "../models/shopItem";
import { ShoppingCategories } from "./shopping-categories";
import { ShoppingItem } from "./shopping-item";
import {
  addIngredient,
  editIngredient,
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
  const { connection } = useSignalR();
  const [ingredientInput, setIngredientInput] = useState("");
  const [editingIngredient, setEditingIngredient] = useState(0);
  const [category, setCategory] = useState(1);
  const { shopItems, refetch } = useFetchShopItems(category);
  const [loading, setLoading] = useState(false);
  const [shopItemMenu, setShopItemMenu] = useState<null | {
    anchorEl: HTMLElement;
    shopItem: ShopItem;
  }>(null);
  
  const { ingredientTypes } = useGetIngredientTypes();
  
  const menuOpen = Boolean(shopItemMenu);


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

  const mutateShopItemAdd = useCallback(
    (shopItem: ShopItem) => {
      queryClient.setQueryData(
        [SHOP_ITEMS_QUERY_KEY, category],
        (old: ShopItem[] | undefined) => {
          const newShopItems = old ? [...old] : [];
          const index = newShopItems.findIndex(
            (item) => item.id === shopItem.id
          );
          newShopItems[index === -1 ? newShopItems.length : index] = shopItem;
          return newShopItems;
        }
      );
    },
    [category, queryClient]
  );

  const onToggled = useCallback(
    (shopItem: ShopItem) => {
      console.log("onToggled");
      if (shopItem.categoryId === category) {
        mutateShopItemAdd(shopItem);
      }
    },
    [category, mutateShopItemAdd]
  );

  useEffect(() => {
    if (connection && connection.state === "Disconnected") {
      connection.start();
      connection?.on("ToggleShopItem", onToggled);
    }
    return () => {
      if (connection && connection.state === "Connected") {
        console.log("disconnecting");
        connection?.stop();
      }
    };
  }, [connection, onToggled]);

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
      shopItemMenu?.shopItem?.ingredientId,
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
        {ingredientTypes?.map((type) => (
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
              : (a.order ?? 99) - (b.order ?? 99)
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
