"use client";

import { useAuth } from "@/app/context/AuthContext";
import React from "react";
import AuthNavbar from "./AuthNavbar";
import GuestNavbar from "./GuestNavbar";

const Navbar = () => {
  const { isAuth } = useAuth();

  const renderNavbar = () => {
    if (isAuth) return <AuthNavbar />;
    return <GuestNavbar />;
  };

  return <>{renderNavbar()}</>;
};

export default Navbar;
