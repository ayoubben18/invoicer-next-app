"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { RecordingControls } from "@/components/shared/recording-controls";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Product added successfully");
    setFormData({ name: "", price: "", description: "" });
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    toast.info("Recording started...");
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    toast.success("Recording sent to AI agent");
  };

  const handleCancelRecording = () => {
    setIsRecording(false);
    toast.info("Recording cancelled");
  };

  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex flex-row gap-4">
        {/* Go Back Button */}
        <Button
          onClick={() => router.push("/products")}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Go Back</span>
        </Button>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Add Product</h1>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter product name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="Enter price"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter product description"
            />
          </div>

          <div className="flex space-x-4">
            <RecordingControls
              isRecording={isRecording}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              onCancelRecording={handleCancelRecording}
            />

            <Button type="submit" className="flex items-center space-x-2">
              <Send className="h-4 w-4" />
              <span>Add Product</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
