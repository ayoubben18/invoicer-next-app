"use client";

import { Avatar } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const invoices = [
  {
    id: "INV001",
    customer: "John Doe",
    amount: "$1,200",
    status: "paid",
    date: "2024-03-20",
  },
  {
    id: "INV002",
    customer: "Jane Smith",
    amount: "$800",
    status: "pending",
    date: "2024-03-19",
  },
  {
    id: "INV003",
    customer: "Bob Johnson",
    amount: "$2,400",
    status: "paid",
    date: "2024-03-18",
  },
  {
    id: "INV004",
    customer: "Alice Brown",
    amount: "$1,600",
    status: "overdue",
    date: "2024-03-17",
  },
];

function RecentInvoices() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <div className="bg-primary/10 w-full h-full flex items-center justify-center text-xs font-medium">
                    {invoice.customer[0]}
                  </div>
                </Avatar>
                <span>{invoice.customer}</span>
              </div>
            </TableCell>
            <TableCell>{invoice.amount}</TableCell>
            <TableCell>
              <Badge
                variant={
                  invoice.status === "paid"
                    ? "default"
                    : invoice.status === "pending"
                    ? "secondary"
                    : "destructive"
                }
              >
                {invoice.status}
              </Badge>
            </TableCell>
            <TableCell>{invoice.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default RecentInvoices;
