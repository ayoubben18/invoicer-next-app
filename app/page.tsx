import { Card } from "@/components/ui/card";
import { FileText, Package, Users } from "lucide-react";
import { VoiceChat } from "@/components/shared";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        AI-Powered Stock Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <Package className="w-12 h-12 mb-4 text-primary" />
          <h2 className="text-xl font-semibold mb-2">Stock Management</h2>
          <p className="text-muted-foreground">
            Manage your inventory with voice commands or text chat
          </p>
        </Card>

        <Card className="p-6">
          <Users className="w-12 h-12 mb-4 text-primary" />
          <h2 className="text-xl font-semibold mb-2">Provider Management</h2>
          <p className="text-muted-foreground">
            Handle provider communications and automated notifications
          </p>
        </Card>

        <Card className="p-6">
          <FileText className="w-12 h-12 mb-4 text-primary" />
          <h2 className="text-xl font-semibold mb-2">Invoice Generation</h2>
          <p className="text-muted-foreground">
            Create and manage invoices seamlessly
          </p>
        </Card>
      </div>

      <VoiceChat />
    </main>
  );
}
