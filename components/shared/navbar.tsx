"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileText, Package, Users } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "@/services/database";
import { useRouter } from "next/navigation";
const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Products", href: "/products", icon: Package },
  { name: "Customers", href: "/customers", icon: Users },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { mutateAsync } = useMutation({
    mutationFn: signOut,
  });

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-semibold">InvoiceAI</span>
          </div>
          <div className="flex items-center space-x-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "default" : "ghost"}
                    className={cn(
                      "flex items-center space-x-2",
                      pathname === item.href &&
                        "bg-primary text-primary-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              );
            })}
            <ThemeToggle />
            <Button
              onClick={async () => {
                await mutateAsync();
                router.push("/login");
              }}
              variant={"destructive"}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
