import './shopping-list.scss';

import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { ShopItem } from '../models/shopItem';
import { ShoppingItem } from './shopping-item';
import { Snackbar, TextField } from '@mui/material';
import { addIngredient, editIngredient, toggleShopItem } from './shopping-list-service';
import React, { useState } from 'react';

export const ShoppingList = () => {
  const [ ingredientInput, setIngredientInput ] = useState('');
  const [ editingIngredient, setEditingIngredient ] = useState(0);
  const [ snackbarOpen, setSnackbarOpen ] = useState(false);
  const [ snackbarMsg, setSnackbarMsg ] = useState('');

  const { data: ingredients, mutate: mutateIngredients } = useSWR(
    'https://localhost:7267/api/ShopItems',
    fetcher,
    { refreshInterval: 2000 }
  );

  const onEditIngredient = async (shopItem: ShopItem) => {
    setEditingIngredient(0);
    if ( shopItem.recentlyUsed > 0 ) {
      setSnackbarMsg(`${!shopItem.ingredient.name} removed`);
      setSnackbarOpen(true);
    }
    const modifiedShopItem = await editIngredient(shopItem);
    mutateShopItemAdd(modifiedShopItem);
  };

  const onAddIngredient = async (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter'){
      const shopItem = await addIngredient(ingredientInput);
      mutateShopItemAdd(shopItem);
      setIngredientInput('');
    }
  }

  const mutateShopItemAdd = (shopItem: ShopItem) => {
    const newShopItems: ShopItem[] = [...ingredients];
    const index = newShopItems.findIndex(item => item.id === shopItem.id);
    newShopItems[index] = shopItem;
    mutateIngredients(newShopItems);
  }


  const onToggleHaveBought = async (id: number) => {
    const shopItem = await toggleShopItem(id);
    mutateShopItemAdd(shopItem);
  }

  return (
    <div>
      <TextField className="ingredient-input"
                 label="Add item"
                 value={ingredientInput}
                 onChange={(e) => setIngredientInput(e?.target?.value)}
                 onKeyDown={(e) => onAddIngredient(e)}
                 variant="outlined"/>
      <GroceryList ingredients={ingredients}
                   haveBought={false}
                   editingIngredient={editingIngredient}
                   setEditingIngredient={setEditingIngredient}
                   onEditIngredient={onEditIngredient}
                   toggleHaveBought={onToggleHaveBought}
      />
      <h4>Recently used:</h4>
      <GroceryList ingredients={ingredients}
                   haveBought={true}
                   editingIngredient={editingIngredient}
                   setEditingIngredient={setEditingIngredient}
                   onEditIngredient={onEditIngredient}
                   toggleHaveBought={onToggleHaveBought}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </div>
  );
};

const GroceryList = (props: {
  ingredients: ShopItem[],
  haveBought: boolean,
  editingIngredient: number,
  setEditingIngredient: (id: number) => void,
  toggleHaveBought: (id: number) => void,
  onEditIngredient: (ingredient: ShopItem) => void
}) => {
  return (
    <div className="shopping-list">
      {props.ingredients && props.ingredients
        .filter(grocery => (grocery.recentlyUsed > 0) === props.haveBought)
        .sort((a, b) => props.haveBought ? b.recentlyUsed - a.recentlyUsed : b.id - a.id)
        .map(grocery =>
          <ShoppingItem
            shopItem={grocery}
            key={grocery.id}
            editIngredient={props.onEditIngredient}
            toggleHaveBought={props.toggleHaveBought}
            isEditing={ props.editingIngredient === grocery.id}
            setEdit={props.setEditingIngredient}/>
        )}
    </div>
  );
};

