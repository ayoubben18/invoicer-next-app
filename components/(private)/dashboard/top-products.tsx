"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const products = [
  { name: "Product A", sales: 120, revenue: "$12,000" },
  { name: "Product B", sales: 98, revenue: "$9,800" },
  { name: "Product C", sales: 86, revenue: "$8,600" },
  { name: "Product D", sales: 72, revenue: "$7,200" },
  { name: "Product E", sales: 65, revenue: "$6,500" },
];

function TopProducts() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead className="text-right">Sales</TableHead>
          <TableHead className="text-right">Revenue</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.name}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell className="text-right">{product.sales}</TableCell>
            <TableCell className="text-right">{product.revenue}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default TopProducts;
