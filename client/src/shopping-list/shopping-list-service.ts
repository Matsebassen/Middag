import { ShopItem } from '../models/shopItem';
import axios from  'axios';

const API = 'https://middagsapp.azurewebsites.net/API/MiddagsApp';

export const editIngredient = (ingredient: ShopItem): Promise<ShopItem[]> => {
  return axios.post(`${API}/EditShopIngredient`, ingredient)
    .then(res => res.data);
}

export const addIngredient = (name: string): Promise<ShopItem[]> => {
  const ingredient: ShopItem = {name, haveBought: false, desc: '', id: 0};
  return axios.post(`${API}/AddIngredientToShoppingList`, ingredient)
    .then(res => res.data);
}
