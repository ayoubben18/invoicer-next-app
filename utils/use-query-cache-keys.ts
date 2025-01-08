const useQueryCacheKeys = {
  providers: {
    getItems: (searchTerm?: string, category?: string) => [
      "providers",
      searchTerm,
      category,
    ],
  },
  products: {
    getItems: (searchTerm?: string, category?: string) => [
      "products",
      searchTerm,
      category,
    ],
  },
} as const;

export default useQueryCacheKeys;
