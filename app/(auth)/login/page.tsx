import { LoginForm } from "@/components/(auth)/login/login-form";
import { Card } from "@/components/ui/card";
import React from "react";

const page = () => {
  return (
    <Card className="w-1/3 mx-auto p-5">
      <LoginForm />
    </Card>
  );
};

export default page;
