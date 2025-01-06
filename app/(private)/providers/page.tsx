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
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { getProviders } from './../../../services/api-calls/get-providers';

export default function ProviderList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["providers"],
    queryFn: () => getProviders(),
  });

  // Extract unique categories from the fetched data
  const uniqueCategories = [
    ...new Set(data?.map((provider) => provider.category) || []),
  ];

  const filteredData = data?.filter((provider) => {
    const matchesSearch = provider.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || provider.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const router = useRouter();

  return (
    <div className="p-6 space-y-4">
      {/* Title */}
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Providers List
        </h1>
        {/* Add Product Button */}
        <div className="flex mb-4">
          <Button onClick={() => router.push("/add-provider")}>
            Add Provider
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

          <Select
            value={categoryFilter}
            onValueChange={(value) => setCategoryFilter(value)}
          >
            <SelectTrigger className="w-full md:w-1/4">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {uniqueCategories.map((category, index) => (
                <SelectItem key={index} value={category!}>
                  {category}
                </SelectItem>
              ))}
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
            Failed to load providers: {String(error)}
          </div>
        )}

        {/* No Data */}
        {!isLoading && (!filteredData || filteredData.length === 0) && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No providers found.
          </div>
        )}

        {/* Product Table */}
        {!isLoading && filteredData && filteredData.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Identity card</TableHead>
                  <TableHead>Phone number</TableHead>
                  <TableHead>Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell>{provider.name}</TableCell>
                    <TableCell>{provider.identity_card}</TableCell>
                    <TableCell>{provider.phone_number}</TableCell>
                    <TableCell>{provider.category}</TableCell>
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
