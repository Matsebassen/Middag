import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { API } from "../api";
import { ShopItem } from "../models/shopItem";

export const SHOP_ITEMS_QUERY_KEY = "shopItems";

export const useFetchShopItems = (categoryId: number) => {
  const query = useSuspenseQuery({
    queryKey: [SHOP_ITEMS_QUERY_KEY, categoryId],
    //refetchInterval: 2000,
    queryFn: () =>
      axios
        .get<ShopItem[]>(`${API}/ShopItems/${categoryId}`)
        .then((res) => res.data),
  });
  return { ...query, shopItems: query.data };
};
