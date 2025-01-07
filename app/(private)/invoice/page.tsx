"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Printer, Trash2 } from "lucide-react";
import generatePDF from "react-to-pdf";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAvailableProducts,
  updateProductQuantity,
} from "@/services/database/sales";
import { toast } from "sonner";

interface TeamInfo {
  name: string;
  slogan: string;
  description: string;
  logoUrl: string;
  location: string;
  foundedYear: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sku: string;
}

interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export default function SalesPage() {
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [teamInfo] = useState<TeamInfo>({
    name: "Tech Haven",
    slogan: "Your One-Stop Electronics Shop",
    description:
      "At Tech Haven, we offer the latest and greatest in electronics, from cutting-edge gadgets to everyday tech essentials. Discover a world of innovation at unbeatable prices.",
    logoUrl:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "San Francisco, CA",
    foundedYear: "2018",
  });

  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["available-products"],
    queryFn: () => getAvailableProducts(),
  });

  const {mutateAsync: updateQuantityMutation , isPending} = useMutation({
    mutationFn: updateProductQuantity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["available-products"] });
    },
  });

  const addItem = () => {
    setSaleItems([
      ...saleItems,
      { productId: "", name: "", quantity: 1, price: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof SaleItem,
    value: string | number
  ) => {
    const updatedItems = [...saleItems];
    if (field === "productId") {
      const product = products.find((p) => p.id === value);
      if (product) {
        updatedItems[index] = {
          ...updatedItems[index],
          productId: value as string,
          name: product.name,
          price: product.price!,
        };
      }
    } else {
      updatedItems[index] = { ...updatedItems[index], [field]: value };
    }
    setSaleItems(updatedItems);
  };

  const calculateTotal = () => {
    return (
      saleItems.reduce((sum, item) => sum + item.quantity * item.price, 0) || 0
    );
  };

  const processSale = async () => {
    try {
      await Promise.all(
        saleItems.map((item) =>
          updateQuantityMutation({
            productId: item.productId,
            quantity: item.quantity,
            customerName: customerName, // Pass the customer name here
          })
        )
      );
      setSaleItems([]);
      setCustomerName("");
      toast.info("Sale operation has been successfully")
    } catch (error) {
      console.error("Error processing sale:", error);
    }
  };

  const handlePrint = () => {
    if (!invoiceRef.current) return;

    // Temporarily show the invoice element
    invoiceRef.current.classList.remove("hidden");

    generatePDF(() => invoiceRef.current!, {
      filename: `invoice-${new Date().toISOString()}.pdf`,
      method: "save",
      page: {
        margin: 10,
        format: "a4",
        orientation: "portrait",
      },
      canvas: {
        mimeType: "image/png",
        qualityRatio: 1,
      },
      overrides: {
        pdf: {
          compress: true,
        },
        canvas: {
          useCORS: true,
        },
      },
    }).then(() => {
      // Hide the invoice element again after generating the PDF
      invoiceRef.current!.classList.add("hidden");
    });
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>New Sale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium">Customer Name</label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="mt-1"
              />
            </div>

            <div className="space-y-4">
              {saleItems.map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <Select
                      value={item.productId}
                      onValueChange={(value) =>
                        updateItem(index, "productId", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} (Stock: {product.quantity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", parseInt(e.target.value))
                      }
                      placeholder="Qty"
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      value={item.price * item.quantity}
                      disabled
                      placeholder="Price"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <Button onClick={addItem} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
              <div className="text-xl font-bold">
                Total: ${calculateTotal().toFixed(2)}
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={processSale} className="flex-1">
                {isPending ? "Loading ..."  : "Complete Sale"}
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print Invoice
              </Button>
            </div>

            {/* Invoice Template */}
            <div
              ref={invoiceRef}
              className="hidden print:block p-6 bg-white text-black"
            >
              <div className="text-center mb-8">
                <img
                  src={teamInfo.logoUrl}
                  alt="Logo"
                  className="w-24 h-24 mx-auto mb-4"
                />
                <h1 className="text-2xl font-bold">{teamInfo.name}</h1>
                <p className="text-gray-600">{teamInfo.slogan}</p>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Invoice</h2>
                <p>Customer: {customerName}</p>
                <p>Date: {new Date().toLocaleDateString()}</p>
              </div>

              <table className="w-full mb-6">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Product</th>
                    <th className="p-2 text-right">Quantity</th>
                    <th className="p-2 text-right">Price</th>
                    <th className="p-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {saleItems.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{item.name}</td>
                      <td className="p-2 text-right">{item.quantity}</td>
                      <td className="p-2 text-right">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="p-2 text-right">
                        ${(item.quantity * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-right">
                <p className="text-xl font-bold">
                  Total: ${calculateTotal().toFixed(2)}
                </p>
              </div>

              <div className="mt-8 text-center text-gray-500">
                <p>Thank you for shopping with us!</p>
                <p className="text-sm">
                  Generated by <strong>Invoicer</strong>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
