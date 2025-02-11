import { RecipeItem } from "./recipeItem";

export type Dinner = {
  id?: string;
  name: string;
  picUrl: string;
  portions: string;
  tags: string;
  url: string;
  ingredients: RecipeItem[];
};
