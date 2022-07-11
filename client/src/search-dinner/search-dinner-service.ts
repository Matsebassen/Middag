import axios from 'axios';
import { Dinner } from '../models/dinner';

const API = 'https://localhost:7267/api';

export const searchDinner = (search: string): Promise<Dinner[]> => {
  return axios.get(`${API}/DinnerItems/search/${search}`)
    .then(res => res.data);
};

export const editDinner = (dinner: Dinner): Promise<Dinner> => {
  return axios.put(`${API}/DinnerItems/${dinner.id}`, dinner)
    .then(res => res.data);
};

export const addDinnerToShoppingList = (id: number): Promise<string> => {
  return axios.post(`${API}/ShopItems/addDinner/${id}`)
    .then(res => res.data);
};
