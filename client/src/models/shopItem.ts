import { IngredientItem } from "./ingredient";

export type ShopItem = {
  id: number;
  description?: string;
  recentlyUsed: number;
  categoryId: number;
  ingredientItem: IngredientItem;
};
