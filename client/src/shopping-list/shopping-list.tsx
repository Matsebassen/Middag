import './shopping-list.scss';

import useSWR from 'swr';
import { fetcher } from '../fetcher';
import {NameId, ShopItem} from '../models/shopItem';
import { ShoppingItem } from './shopping-item';
import {LinearProgress, Menu, MenuItem, TextField} from '@mui/material';
import {
  addIngredient,
  editIngredient,
  getIngredientTypes,
  setIngredientType,
  toggleShopItem
} from './shopping-list-service';
import React, {Fragment, useEffect, useState} from 'react';
import { API } from '../api';

export const ShoppingList = () => {
  const [ ingredientInput, setIngredientInput ] = useState('');
  const [ editingIngredient, setEditingIngredient ] = useState(0);
  const [ loading, setLoading ] = useState(false);
  const [ingredientTypes, setIngredientTypes] = useState([] as NameId[]);
  const [ shopItemMenu, setShopItemMenu ] = useState<null | { anchorEl: HTMLElement, shopItem: ShopItem }>(null);
  const menuOpen = Boolean(shopItemMenu);


  const { data: ingredients, mutate: mutateIngredients } = useSWR(
    `${API}/ShopItems`,
    fetcher,
    { refreshInterval: 2000 }
  );

  useEffect( () => {
    (async () => {
      const ingredientTypes = await getIngredientTypes();
      setIngredientTypes(ingredientTypes);
    })();
    return () => {};
  }, []);

  const onEditIngredient = async (shopItem: ShopItem) => {
    setLoading(true);
    setEditingIngredient(0);
    const modifiedShopItem = await editIngredient(shopItem);
    mutateShopItemAdd(modifiedShopItem);
    setLoading(false);
  };

  const onAddIngredient = async (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter'){
      setLoading(true);
      const shopItem = await addIngredient(ingredientInput);
      mutateShopItemAdd(shopItem);
      setIngredientInput('');
      setLoading(false);
    }
  }

  const mutateShopItemAdd = (shopItem: ShopItem) => {
    const newShopItems: ShopItem[] = [...ingredients];
    const index = newShopItems.findIndex(item => item.id === shopItem.id);
    newShopItems[index] = shopItem;
    mutateIngredients(newShopItems);
  }


  const onToggleHaveBought = async (id: number) => {
    setLoading(true);
    const shopItem = await toggleShopItem(id);
    mutateShopItemAdd(shopItem);
    setLoading(false);
  }

  function handleMenuClose() {
    setShopItemMenu(null);
  }

  const onSetIngredientType = async (ingredientTypeId: number | undefined) => {
    setShopItemMenu(null);
    const ingredient = await setIngredientType(shopItemMenu?.shopItem?.ingredient?.id, ingredientTypeId);
  }

  return (
    <Fragment>
      <Menu
        id="basic-menu"
        anchorEl={shopItemMenu?.anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {ingredientTypes.map(type => (
          <MenuItem key={type.id} onClick={() => onSetIngredientType(type.id)}>{type.name}</MenuItem>))}
      </Menu>
      <div>
        <TextField className="ingredient-input"
                   label="Add item"
                   value={ingredientInput}
                   onChange={(e) => setIngredientInput(e?.target?.value)}
                   onKeyDown={(e) => onAddIngredient(e)}
                   variant="outlined"/>
        {loading && <LinearProgress></LinearProgress>}
        <GroceryList ingredients={ingredients}
                     haveBought={false}
                     editingIngredient={editingIngredient}
                     setEditingIngredient={setEditingIngredient}
                     onEditIngredient={onEditIngredient}
                     toggleHaveBought={onToggleHaveBought}
                     openMenu={(event, shopItem) => setShopItemMenu({anchorEl: event.currentTarget, shopItem})}
        />
        <h4>Recently used:</h4>
        <GroceryList ingredients={ingredients}
                     haveBought={true}
                     editingIngredient={editingIngredient}
                     setEditingIngredient={setEditingIngredient}
                     onEditIngredient={onEditIngredient}
                     toggleHaveBought={onToggleHaveBought}
                     openMenu={(event, shopItem) => setShopItemMenu({anchorEl: event.currentTarget, shopItem})}
        />
      </div>
    </Fragment>
  );
};

const GroceryList = (props: {
  ingredients: ShopItem[],
  haveBought: boolean,
  editingIngredient: number,
  setEditingIngredient: (id: number) => void,
  toggleHaveBought: (id: number) => void,
  onEditIngredient: (ingredient: ShopItem) => void
  openMenu: (event: React.MouseEvent<HTMLButtonElement>, shopItem: ShopItem) => void
}) => {
  return (
    <div className="shopping-list">
      {props.ingredients && props.ingredients
        .filter(grocery => (grocery.recentlyUsed > 0) === props.haveBought)
        .sort((a, b) => props.haveBought
          ? b.recentlyUsed - a.recentlyUsed
          : (a.ingredient?.ingredientType?.order ?? 99) - (b.ingredient?.ingredientType?.order ?? 99))
        .map(grocery =>
          <ShoppingItem
            shopItem={grocery}
            key={grocery.id}
            editIngredient={props.onEditIngredient}
            toggleHaveBought={props.toggleHaveBought}
            isEditing={ props.editingIngredient === grocery.id}
            setEdit={props.setEditingIngredient}
            openMenu={props.openMenu}/>
        )}
    </div>
  );
};

