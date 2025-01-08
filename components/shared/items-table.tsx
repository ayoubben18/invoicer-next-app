"use client";

import { TableLoadingSkeleton } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product, Provider } from "@/db/schema";
import { useDataFetcher } from "@/hooks/use-data-fetcher";
import { routes } from "@/routes";
import { textCapitalizer } from "@/utils/lib";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import CategoriesFilter from "./categories-filter";

type Props = {
  type: "products" | "providers";
  initialData: Product[] | Provider[];
  categories: string[];
  dataKeys: string[];
};

const Component = ({ initialData, categories, dataKeys, type }: Props) => {
  const {
    data,
    isLoading,
    error,
    isFetching,
    isPending,
    router,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
  } = useDataFetcher(type, initialData);

  if (error) toast.error("Failed to load providers");

  return (
    <div className="p-6 space-y-4">
      {/* Title */}
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {type === "providers" ? "Providers" : "Products"} List
        </h1>
        {/* Add Product Button */}
        <div className="flex mb-4">
          <Button
            onClick={() => router.push(routes[`add_${type}`].route)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add {type === "providers" ? "Provider" : "Product"}</span>
          </Button>
        </div>
      </div>
      <Card className="p-5">
        {/* Search and Filter Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-2">
          <Input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3"
          />
          <CategoriesFilter
            options={categories}
            value={categoryFilter}
            onChange={setCategoryFilter}
          />
        </div>

        {/* Product Table */}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {dataKeys.map((key) => (
                  <TableHead key={key}>{textCapitalizer(key)}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data &&
                data.map((item) => (
                  <TableRow key={item.id}>
                    {dataKeys.map((key) => (
                      <TableCell key={key}>
                        {item[key as keyof typeof item]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
            {isLoading || isFetching || isPending ? (
              <TableLoadingSkeleton columns={dataKeys.length} size={5} />
            ) : null}
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Component;
