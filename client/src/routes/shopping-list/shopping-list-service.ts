import axios from "axios";
import { API } from "../../api";
import { ShopItem } from "../../models/shopItem";

export const editIngredient = (shopItem: ShopItem): Promise<ShopItem> => {
  return axios
    .put(`${API}/ShopItems/${shopItem.id}`, shopItem)
    .then((res) => res.data);
};

export const toggleShopItem = (id: string): Promise<ShopItem> => {
  return axios.patch(`${API}/ShopItems/toggle/${id}`).then((res) => res.data);
};
