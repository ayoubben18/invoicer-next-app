"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProducts } from "@/services/database/get-products";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function ProductList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [quantityFilter, setQuantityFilter] = useState<"all" | "low" | "high">(
    "all"
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const filteredData = data?.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesQuantity =
      quantityFilter === "all" ||
      (quantityFilter === "low" && product.quantity <= 50) ||
      (quantityFilter === "high" && product.quantity > 50);

    return matchesSearch && matchesQuantity;
  });
  const router = useRouter();

  return (
    <div className="p-6 space-y-4">
      {/* Title */}
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Products List
        </h1>
        {/* Add Product Button */}
        <div className="flex mb-4">
          <Button onClick={() => router.push("/add-product")}>
            Add Product
          </Button>
        </div>
      </div>
      <Card className="p-5">
        {/* Search and Filter Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <Input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3"
          />

          <Select
            value={quantityFilter}
            onValueChange={(value) =>
              setQuantityFilter(value as "all" | "low" | "high")
            }
          >
            <SelectTrigger className="w-full md:w-1/4">
              <SelectValue placeholder="Filter by quantity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="low">Low Stock (50 or less)</SelectItem>
              <SelectItem value="high">High Stock (more than 50)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-2">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="h-6 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex justify-center items-center text-red-500">
            Failed to load products: {String(error)}
          </div>
        )}

        {/* No Data */}
        {!isLoading && (!filteredData || filteredData.length === 0) && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No products found.
          </div>
        )}

        {/* Product Table */}
        {!isLoading && filteredData && filteredData.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>$99.9</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      {new Date(product.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
