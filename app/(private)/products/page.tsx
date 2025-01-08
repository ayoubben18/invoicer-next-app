import ItemsTable from "@/components/shared/items-table";
import { getProducts } from "@/services/database";

export default async function ProductList() {
  const [products] = await Promise.all([getProducts({})]);
  return (
    <ItemsTable
      categories={["all", "low", "high"]}
      initialData={products}
      type="products"
      dataKeys={["name", "quantity", "price"]}
    />
  );
}
