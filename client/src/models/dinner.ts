import { Ingredient } from './ingredient';

export type Dinner = {
  id?: number,
  name: string,
  picUrl: string,
  portions: string,
  tags: string,
  url: string,
  ingredients: Ingredient[]
}
