import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import axios from "axios";
import { API } from "../api";
import { NameId } from "../models/name-id";

export const useFetchCategories = () => {
  const query = useSuspenseQuery({
    queryKey: ["categories"],
    refetchOnWindowFocus: false,
    queryFn: () =>
      axios.get<NameId[]>(`${API}/category`).then((res) => res.data),
  });

  return { ...query, categories: query.data };
};

export const useEditCategory = () => {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: (category: NameId) =>
      axios.put<NameId>(`${API}/category`, category).then((res) => res.data),
    onSuccess: (category) =>
      queryClient.setQueryData(
        ["categories"],
        (categories: NameId[] | undefined) =>
          categories?.map((c) => (c.id === category.id ? category : c))
      ),
  });

  return { ...query, editCategory: query.mutateAsync };
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: (categoryId: number | undefined) =>
      axios
        .delete<void>(`${API}/category/${categoryId}`)
        .then((res) => categoryId),
    onSuccess: (categoryId) =>
      queryClient.setQueryData(
        ["categories"],
        (categories: NameId[] | undefined) =>
          categories?.filter((c) => c.id !== categoryId)
      ),
  });

  return { ...query, deleteCategory: query.mutateAsync };
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: (categoryName: string) =>
      axios
        .post<NameId>(`${API}/category`, { name: categoryName })
        .then((res) => res.data),
    onSuccess: (category: NameId) =>
      queryClient.setQueryData(
        ["categories"],
        (categories: NameId[] | undefined) => [
          ...(categories || []),
          { ...category },
        ]
      ),
  });

  return { ...query, addCategory: query.mutateAsync };
};
