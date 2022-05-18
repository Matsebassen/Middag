import { Ingredient } from '../models/ingredient';
import axios, { Axios } from  'axios';

const API = 'https://middagsapp.azurewebsites.net/API/MiddagsApp';

export const editIngredient = (ingredient: Ingredient): Promise<Ingredient[]> => {
  return axios.post(`${API}/EditShopIngredient`, ingredient)
    .then(res => res.data);
}

export const addIngredient = (name: string): Promise<Ingredient[]> => {
  const ingredient: Ingredient = {name, haveBought: false, desc: '', id: 0};
  return axios.post(`${API}/AddIngredientToShoppingList`, ingredient)
    .then(res => res.data);
}
