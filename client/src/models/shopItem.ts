export type ShopItem = {
  id: number;
  description?: string
  recentlyUsed: number;
  ingredient: Ingredient
};

export interface NameId {
  name: string;
  id?: number;
}

export interface Ingredient extends NameId{
  ingredientType?: IngredientType;
}

export interface IngredientType extends NameId{
  order?: number;
}