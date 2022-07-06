import axios from 'axios';
import { Dinner } from '../models/dinner';
import { RecipeItem } from '../models/recipeItem';

const API = 'https://localhost:7267/api';

export const searchDinner = (search: string): Promise<Dinner[]> => {
  return axios.get(`${API}/DinnerItems/search/${search}`)
    .then(res => res.data);
};

export const editDinner = (dinner: Dinner): Promise<string> => {
  return axios.put(`${API}/DinnerItems/${dinner.id}`, dinner)
    .then(res => res.data);
};

export const addDinnerToShoppingList = (id: number): Promise<string> => {
  return axios.post(`${API}/addDinnerToShopList/${id}`)
    .then(res => res.data);
};
