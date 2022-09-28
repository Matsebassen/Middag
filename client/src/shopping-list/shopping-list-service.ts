import {Ingredient, NameId, ShopItem} from '../models/shopItem';
import axios from 'axios';
import { API } from '../api';
import {RecipeItem} from "../models/recipeItem";

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

export const getIngredientTypes = (): Promise<NameId[]> => {
  return axios.get(`${API}/ShopItems/ingredientTypes`)
    .then(res => res.data);
}

export const setIngredientType = (ingredientId: number | undefined, ingredientTypeId: number | undefined): Promise<Ingredient> => {
  return axios.patch(`${API}/ShopItems/setIngredientType/${ingredientId}/${ingredientTypeId}`)
    .then(res => res.data);
}
