"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const ProtectedRouteLayout = ({ children }: { children: ReactNode }) => {
  const { isAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      router.replace("/login");
    }
  }, [isAuth, router]);

  // Optional: render null until auth is checked
  if (!isAuth) return null;

  return <>{children}</>;
};

export default ProtectedRouteLayout;
