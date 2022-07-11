import { ShopItem } from '../models/shopItem';
import axios from 'axios';
import { API } from '../api';

export const editIngredient = (shopItem: ShopItem): Promise<ShopItem> => {
  return axios.put(`${API}/ShopItems/${shopItem.id}`, shopItem)
    .then(res => res.data);
};

export const addIngredient = (name: string): Promise<ShopItem> => {
  const ingredient: ShopItem = { ingredient: { name: name }, recentlyUsed: 0, id: 0 };
  return axios.post(`${API}/ShopItems`, ingredient)
    .then(res => res.data);
}

export const toggleShopItem = (id: number): Promise<ShopItem> => {
  return axios.patch(`${API}/ShopItems/toggle/${id}`)
    .then(res => res.data);
}
