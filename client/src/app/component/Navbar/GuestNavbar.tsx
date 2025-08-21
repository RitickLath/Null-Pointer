"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { MdOutlineDarkMode, MdDarkMode, MdMenu, MdClose } from "react-icons/md";

const GuestNavbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove("dark");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      setIsDark(true);
    }
  };

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    }
  }, []);

  return (
    <div className="relative px-6 py-3 shadow-2xl">
      {/* Large Screen */}
      <div className="hidden items-center justify-between md:flex">
        <h1 className="cursor-pointer text-xl font-bold">Null Pointer</h1>
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <button className="cursor-pointer rounded-full px-4 py-1 transition-colors">
              Login
            </button>
          </Link>
          <Link href="/register">
            <button className="cursor-pointer rounded-full px-4 py-1 transition-colors">
              Register
            </button>
          </Link>
          <button
            onClick={toggleDarkMode}
            className="cursor-pointer rounded-full px-4 py-1 transition-colors"
          >
            {isDark ? (
              <MdOutlineDarkMode className="text-xl" />
            ) : (
              <MdDarkMode className="text-xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Screen */}
      <div className="flex items-center justify-between md:hidden">
        <h1 className="cursor-pointer text-xl font-bold">Null Pointer</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleDarkMode}
            className="cursor-pointer rounded-full p-2 transition-colors"
          >
            {isDark ? (
              <MdOutlineDarkMode className="text-xl" />
            ) : (
              <MdDarkMode className="text-xl" />
            )}
          </button>
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="cursor-pointer p-2"
          >
            {drawerOpen ? (
              <MdClose className="text-2xl" />
            ) : (
              <MdMenu className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="bg-secondary-light dark:bg-secondary-dark absolute top-full left-0 z-50 flex w-full flex-col items-center space-y-2 py-4 shadow-lg">
          <Link href="/login">
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-full cursor-pointer rounded-full px-6 py-2 text-left transition-colors"
            >
              Login
            </button>
          </Link>
          <Link href="/register">
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-full cursor-pointer rounded-full px-6 py-2 text-left transition-colors"
            >
              Register
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default GuestNavbar;
