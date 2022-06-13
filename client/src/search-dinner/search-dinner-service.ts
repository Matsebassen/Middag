import axios from 'axios';
import { Dinner } from '../models/dinner';
import { Ingredient } from '../models/ingredient';

const API = 'https://middagsapp.azurewebsites.net/API/MiddagsApp';

export const searchDinner = (search: string): Promise<Dinner[]> => {
  return axios.post(`${API}/SearchDinner`, search, { headers: { 'Content-Type': 'application/json' } })
    .then(res => res.data);
};

export const getIngredients = (id: number): Promise<Ingredient[]> => {
  return axios.post(`${API}/GetIngredients`, id, { headers: { 'Content-Type': 'application/json' } })
    .then(res => res.data);
};

export const editDinner = (dinner: Dinner): Promise<string> => {
  return axios.post(`${API}/EditDinner`, dinner)
    .then(res => res.data);
};

export const addDinnerToShoppingList = (dinner: Dinner): Promise<string> => {
  return axios.post(`${API}/addDinnerToShopList`, dinner)
    .then(res => res.data);
};
