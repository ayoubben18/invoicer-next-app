import { RegisterForm } from "@/components/(auth)";
import { Card } from "@/components/ui/card";
import React from "react";

const page = () => {
  return (
    <Card className="w-1/3 mx-auto p-5">
      <RegisterForm />
    </Card>
  );
};

export default page;
