import { getCategories, getProviders } from "@/services/database";
import ItemsTable from "@/components/shared/items-table";

export default async function ProviderList() {
  const [categories, providers] = await Promise.all([
    getCategories(),
    getProviders({}),
  ]);
  return (
    <ItemsTable
      categories={["all", ...categories]}
      initialData={providers}
      type="providers"
      dataKeys={["name", "identity_card", "phone_number", "category"]}
    />
  );
}
