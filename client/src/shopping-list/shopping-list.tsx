import './shopping-list.scss';

import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { ShopItem } from '../models/shopItem';
import { ShoppingItem } from './shopping-item';
import { Snackbar, TextField } from '@mui/material';
import { addIngredient, editIngredient } from './shopping-list-service';
import React, { useState } from 'react';

export const ShoppingList = () => {
  const [ ingredientInput, setIngredientInput ] = useState('');
  const [ editingIngredient, setEditingIngredient ] = useState(0);
  const [ snackbarOpen, setSnackbarOpen ] = useState(false);
  const [ snackbarMsg, setSnackbarMsg ] = useState('');

  const { data: ingredients, mutate: mutateIngredients } = useSWR(
    'https://middagsapp.azurewebsites.net/API/MiddagsApp/GetShoppingList',
    fetcher,
    { refreshInterval: 2000 }
  );

  const onEditIngredient = async (ingredient: ShopItem) => {
    setEditingIngredient(0);
    if ( ingredient.haveBought ) {
      setSnackbarMsg(`${ingredient.name} removed`);
      setSnackbarOpen(true);
    }
    const ingredients = await editIngredient(ingredient);
    mutateIngredients(ingredients);
  };

  const onAddIngredient = async (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter'){
      const ingredients = await addIngredient(ingredientInput);
      mutateIngredients(ingredients);
      setIngredientInput('');
    }
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
      />
      <h4>Recently used:</h4>
      <GroceryList ingredients={ingredients}
                   haveBought={true}
                   editingIngredient={editingIngredient}
                   setEditingIngredient={setEditingIngredient}
                   onEditIngredient={onEditIngredient}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
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
  onEditIngredient: (ingredient: ShopItem) => void
}) => {
  return (
    <div className="shopping-list">
      {props.ingredients && props.ingredients
        .filter(grocery => grocery.haveBought === props.haveBought)
        .map(grocery =>
          <ShoppingItem
            ingredient={grocery}
            key={grocery.id}
            editIngredient={props.onEditIngredient}
            isEditing={ props.editingIngredient === grocery.id}
            setEdit={props.setEditingIngredient}/>
        )}
    </div>
  );
};

