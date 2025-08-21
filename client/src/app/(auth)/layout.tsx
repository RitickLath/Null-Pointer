"use client";

import React, { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { isAuth } = useAuth();
  const router = useRouter();

  if (isAuth) {
    router.replace("/");
  }

  return <div>{children}</div>;
};

export default AuthLayout;
