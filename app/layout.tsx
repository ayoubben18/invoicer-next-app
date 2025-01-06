import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Navbar } from "@/components/shared/navbar";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/providers/query-provider";
import { createClient } from "@/utils/supabase/supabase-client";
import { authenticatedAction } from "@/services/server-only";

const inter = Inter({ subsets: ["latin"] });



const getUser = await authenticatedAction.create(async (context) => {
  return context
})


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  let email, fullName = undefined;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if(user){
    const authUser = await getUser();
    // console.log("user", authUser);
    email = authUser.email;
    fullName = authUser.fullName;
  }
    


  
  

  return (
    <QueryProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Toaster position="top-right" duration={3000} richColors />
            <div className="min-h-screen bg-background">
              <Navbar user={{name: fullName, email: email}} />
              <main className="container mx-auto px-4 py-6">{children}</main>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </QueryProvider>
  );
}