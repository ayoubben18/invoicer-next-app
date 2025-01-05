import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const PageWrapper = ({ children, className }: Props) => {
  return (
    <div
      className={cn("flex flex-col min-h-screen mx-auto container", className)}
    >
      {children}
    </div>
  );
};

export default PageWrapper;
