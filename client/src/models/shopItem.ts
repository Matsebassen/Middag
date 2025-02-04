export type ShopItem = {
  id: number;
  ingredientId?: number;
  description?: string;
  recentlyUsed: number;
  name: string;
  ingredientTypeId?: number;
  categoryId: number;
  order?: number;
};
