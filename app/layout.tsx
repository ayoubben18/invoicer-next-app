"use client";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Navbar } from "@/components/shared/navbar";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/providers/query-provider";
import { createClient } from "@/utils/supabase/supabase-client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [user, setUser] = useState<User | null>(null);
  
  const user = {
    name: "Ismail Achibat",
    email: "ismai@example.com"
  }

  return (
    <QueryProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Toaster position="top-right" duration={3000} richColors />
            <div className="min-h-screen bg-background">
              <Navbar user={user} />
              <main className="container mx-auto px-4 py-6">{children}</main>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </QueryProvider>
  );
}