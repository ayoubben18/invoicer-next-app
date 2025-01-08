import { Product, Provider } from "@/db/schema";
import { getProducts, getProviders } from "@/services/database";
import useQueryCacheKeys from "@/utils/use-query-cache-keys";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useDataFetcher = (
  type: "products" | "providers",
  initialData: Product[] | Provider[]
) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");

  const { data, isLoading, error, isFetching, isPending } = useQuery({
    queryKey: useQueryCacheKeys[type].getItems(searchTerm, categoryFilter),
    queryFn: () =>
      type === "products"
        ? getProducts({
            searchTerm,
            filter: categoryFilter as "all" | "low" | "high",
          })
        : getProviders({
            searchTerm,
            category: categoryFilter,
          }),
    initialData:
      !searchTerm && categoryFilter === "all" ? initialData : undefined,
  });

  return {
    router,
    data,
    isLoading,
    error,
    isFetching,
    isPending,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    debouncedSearchTerm,
  };
};
