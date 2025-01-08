import { Card } from "@/components/ui/card";
import { DollarSign, Users, Package, TrendingUp } from "lucide-react";
import {
  RecentInvoices,
  RevenueChart,
  TopProducts,
} from "@/components/(private)/dashboard";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <h3 className="text-2xl font-bold">$45,231.89</h3>
              <p className="text-xs text-green-500">+20.1% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Customers</p>
              <h3 className="text-2xl font-bold">2,345</h3>
              <p className="text-xs text-green-500">+15.3% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <h3 className="text-2xl font-bold">1,234</h3>
              <p className="text-xs text-green-500">+12.5% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Growth</p>
              <h3 className="text-2xl font-bold">18.2%</h3>
              <p className="text-xs text-green-500">+4.3% from last month</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Over Time</h3>
          <RevenueChart />
        </Card>

        <Card className="col-span-3 p-6">
          <h3 className="text-lg font-semibold mb-4">Top Products</h3>
          <TopProducts />
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Invoices</h3>
        <RecentInvoices />
      </Card>
    </div>
  );
}
