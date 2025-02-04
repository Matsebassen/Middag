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
    name,
    recentlyUsed: 0,
    id: 0,
    categoryId,
  };
  return axios.post(`${API}/ShopItems`, ingredient).then((res) => res.data);
};

export const toggleShopItem = (id: number): Promise<ShopItem> => {
  return axios.patch(`${API}/ShopItems/toggle/${id}`).then((res) => res.data);
};

export const setIngredientType = (
  ingredientId: number | undefined,
  ingredientTypeId: number | undefined
): Promise<void> => {
  return axios
    .patch(
      `${API}/ShopItems/setIngredientType/${ingredientId}/${ingredientTypeId}`
    )
    .then((res) => res.data);
};
