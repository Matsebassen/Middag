import './shopping-list.scss';

import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { Ingredient } from '../models/ingredient';
import { ShoppingItem } from './shopping-item';
import { TextField } from '@mui/material';
import { addIngredient, editIngredient } from './shopping-list-service';
import React, { useState } from 'react';

export const ShoppingList = () => {
  const [ingredientInput, setIngredientInput] = useState('');
  const [editingIngredient, setEditingIngredient] = useState(0);

  const { data: ingredients, mutate: mutateIngredients } = useSWR(
    'https://middagsapp.azurewebsites.net/API/MiddagsApp/GetShoppingList',
    fetcher,
    { refreshInterval: 2000 }
  );

  const GroceryList = (props: { ingredients: Ingredient[], haveBought: boolean }) => {
    return (
      <div className="shopping-list">
        {props.ingredients && props.ingredients
          .filter(grocery => grocery.haveBought === props.haveBought)
          .map(grocery =>
            <ShoppingItem
              ingredient={grocery}
              key={grocery.id}
              editIngredient={onEditIngredient}
              isEditing={ editingIngredient === grocery.id}
              setEdit={setEditingIngredient}/>
          )}
      </div>
    );
  };

  const onEditIngredient = async (ingredient: Ingredient) => {
    setEditingIngredient(0);
    const ingredients = await editIngredient(ingredient);
    mutateIngredients(ingredients);
  }

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
                   haveBought={false}/>
      <h4>Recently used:</h4>
      <GroceryList ingredients={ingredients}
                   haveBought={true}/>
    </div>
  );
};

