export type ShopItem = {
  id: number;
  description?: string
  recentlyUsed: number;
  ingredient: {
    name: string;
    id?: number;
  }
};
