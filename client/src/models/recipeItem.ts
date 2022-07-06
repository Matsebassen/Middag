export type RecipeItem = {
  id?: number;
  qty: string;
  unit: string;
  ingredient: {
    id?: number;
    name: string;
  }
}
