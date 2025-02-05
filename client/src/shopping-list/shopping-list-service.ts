import axios from "axios";
import { API } from "../api";
import { ShopItem } from "../models/shopItem";

export const editIngredient = (shopItem: ShopItem): Promise<ShopItem> => {
  return axios
    .put(`${API}/ShopItems/${shopItem.id}`, shopItem)
    .then((res) => res.data);
};

export const addIngredient = (
  name: string,
  categoryId: number
): Promise<ShopItem> => {
  const ingredient: ShopItem = {
    recentlyUsed: 0,
    id: 0,
    categoryId,
    ingredientItem: { name }
  };
  return axios.post(`${API}/ShopItems`, ingredient).then((res) => res.data);
};

export const toggleShopItem = (id: number): Promise<ShopItem> => {
  return axios.patch(`${API}/ShopItems/toggle/${id}`).then((res) => res.data);
};
