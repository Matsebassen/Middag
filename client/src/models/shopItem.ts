import { IngredientItem } from "./ingredient";

export type ShopItem = {
  id: string;
  description?: string;
  recentlyUsed: number;
  categoryId: string;
  ingredientId: string;
  ingredientTypeId?: string;
  name: string;
  order?: number;
};
