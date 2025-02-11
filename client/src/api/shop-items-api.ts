import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery
} from "@tanstack/react-query";
import axios from "axios";
import { API } from "../api";
import { ShopItem } from "../models/shopItem";
import { NameId } from "../models/name-id";
import { IngredientItem } from "../models/ingredient";

export const SHOP_ITEMS_QUERY_KEY = "shopItems";

export const useFetchShopItems = (categoryId: string) => {
  const query = useSuspenseQuery({
    queryKey: [SHOP_ITEMS_QUERY_KEY, categoryId],
    //refetchInterval: 2000,
    queryFn: () =>
      axios
        .get<ShopItem[]>(`${API}/ShopItems/${categoryId}`)
        .then((res) => res.data)
  });
  return { ...query, shopItems: query.data };
};

export const useGetIngredientTypes = () => {
  const query = useQuery({
    queryKey: ["ingredientTypes"],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    queryFn: () =>
      axios
        .get<NameId[]>(`${API}/ShopItems/ingredientTypes`)
        .then((res) => res.data)
  });

  return { ...query, ingredientTypes: query.data };
};

export const useAddToShoppingList = (categoryId: string) => {
  const query = useMutation({
    mutationFn: (name: string) =>
      axios
        .post<ShopItem>(
          `${API}/ShopItems/${categoryId}/${encodeURIComponent(name)}`
        )
        .then((res) => res.data)
  });

  return { ...query, addToShoppingList: query.mutateAsync };
};

export const useSetIngredientType = (categoryId: string) => {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: ({
      ingredientId,
      ingredientTypeId
    }: {
      ingredientId?: string;
      ingredientTypeId?: string;
    }) =>
      axios
        .patch<IngredientItem>(
          `${API}/ShopItems/setIngredientType/${ingredientId}/${ingredientTypeId}`
        )
        .then((res) => res.data),
    onSuccess: (result) => {
      queryClient.setQueryData(
        [SHOP_ITEMS_QUERY_KEY, categoryId],
        (old: ShopItem[]) =>
          old.map((shopItem) => {
            if (shopItem.ingredientId === result.id) {
              return {
                ...shopItem,
                ingredientTypeId: result.ingredientTypeId,
                ingredientId: result.id
              };
            }
            return { ...shopItem };
          })
      );
    }
  });
  return { ...query, setIngredientType: query.mutateAsync };
};
