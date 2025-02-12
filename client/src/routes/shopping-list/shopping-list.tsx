import "./shopping-list.scss";

import {
  CircularProgress,
  LinearProgress,
  Menu,
  MenuItem,
  TextField,
  Typography
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import React, {
  Fragment,
  Suspense,
  useEffect,
  useCallback,
  useState
} from "react";
import {
  SHOP_ITEMS_QUERY_KEY,
  useAddToShoppingList,
  useFetchShopItems,
  useGetIngredientTypes,
  useSetIngredientType
} from "../../api/shop-items-api";
import { useSignalR } from "../../hooks/useSignalR";
import { ShopItem } from "../../models/shopItem";
import { ShoppingCategories } from "./shopping-categories";
import { ShoppingItem } from "./shopping-item";
import { editIngredient, toggleShopItem } from "./shopping-list-service";
import { PageHeader } from "../../components/page-header";

export const ShoppingList = () => {
  return (
    <Suspense
      fallback={
        <div>
          <PageHeader>Handleliste</PageHeader>
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
  const [editingIngredient, setEditingIngredient] = useState("0");
  const [category, setCategory] = useState("1");
  const { shopItems } = useFetchShopItems(category);
  const [loading, setLoading] = useState(false);
  const [shopItemMenu, setShopItemMenu] = useState<null | {
    anchorEl: HTMLElement;
    shopItem: ShopItem;
  }>(null);

  const [updatedShopItem, setUpdatedShopItem] = useState<string | null>(null);
  const { ingredientTypes } = useGetIngredientTypes();
  const { setIngredientType } = useSetIngredientType(category);
  const { addToShoppingList } = useAddToShoppingList(category);

  const menuOpen = Boolean(shopItemMenu);

  const onEditIngredient = async (shopItem: ShopItem) => {
    setLoading(true);
    setEditingIngredient("0");
    const modifiedShopItem = await editIngredient(shopItem);
    mutateShopItemAdd(modifiedShopItem);
    setLoading(false);
  };

  const onAddIngredient = async (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (event.key === "Enter") {
      setLoading(true);
      const shopItem = await addToShoppingList(ingredientInput);
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
      updateShopItem(shopItem.id);
    },
    [category, queryClient]
  );

  const onToggled = useCallback(
    (shopItem: ShopItem) => {
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

  const onToggleHaveBought = async (id: string) => {
    setLoading(true);
    const shopItem = await toggleShopItem(id);
    mutateShopItemAdd(shopItem);
    setLoading(false);
  };

  function handleMenuClose() {
    setShopItemMenu(null);
  }

  const onSetIngredientType = async (ingredientTypeId: string | undefined) => {
    const shopItem = { ...shopItemMenu?.shopItem };
    setShopItemMenu(null);
    await setIngredientType({
      ingredientId: shopItem?.ingredientId,
      ingredientTypeId: ingredientTypeId
    });
    updateShopItem(shopItem.id);
  };

  const updateShopItem = (id?: string) => {
    if (!id) {
      return;
    }
    setUpdatedShopItem(id);
    setTimeout(() => setUpdatedShopItem(null), 600);
  };

  return (
    <Fragment>
      <Menu
        id="basic-menu"
        anchorEl={shopItemMenu?.anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button"
        }}
      >
        {ingredientTypes?.map((type) => (
          <MenuItem key={type.id} onClick={() => onSetIngredientType(type.id)}>
            {type.name}
          </MenuItem>
        ))}
      </Menu>
      <div className="shopping-list">
        <PageHeader>Handleliste</PageHeader>
        <ShoppingCategories category={category} setCategory={setCategory} />

        <TextField
          className="ingredient-input"
          label="Ny vare"
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
          updatedShopItem={updatedShopItem}
          setEditingIngredient={setEditingIngredient}
          onEditIngredient={onEditIngredient}
          toggleHaveBought={onToggleHaveBought}
          openMenu={(event, shopItem) =>
            setShopItemMenu({ anchorEl: event.currentTarget, shopItem })
          }
        />
        <h4>Historikk:</h4>
        <GroceryList
          ingredients={shopItems}
          haveBought={true}
          editingIngredient={editingIngredient}
          updatedShopItem={updatedShopItem}
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
  editingIngredient: string;
  updatedShopItem?: string | null;
  setEditingIngredient: (id: string) => void;
  toggleHaveBought: (id: string) => void;
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
              isRecentlyUpdated={props.updatedShopItem === grocery.id}
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
