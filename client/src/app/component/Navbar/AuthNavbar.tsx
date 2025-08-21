"use client";

import Link from "next/link";
import { MdDarkMode, MdOutlineDarkMode, MdMenu, MdClose } from "react-icons/md";
import React, { useState, useEffect } from "react";

const AuthNavbar = () => {
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
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      setIsDark(true);
    }
  }, []);

  return (
    <div className="bg-secondary-light dark:bg-secondary-dark relative px-6 py-3 shadow-2xl">
      {/* Desktop Navbar */}
      <div className="hidden items-center justify-between md:flex">
        <h1 className="cursor-pointer text-xl font-bold">Null Pointer</h1>
        <div className="flex items-center space-x-4">
          <Link href="/problems">
            <button className="cursor-pointer rounded-full px-6 py-1 transition-colors">
              Problems
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="cursor-pointer rounded-full px-6 py-1 transition-colors">
              Dashboard
            </button>
          </Link>
          <Link href="/profile">
            <button className="cursor-pointer rounded-full px-6 py-1 transition-colors">
              Profile
            </button>
          </Link>
          <button className="cursor-pointer rounded-full px-6 py-1 transition-colors">
            Logout
          </button>
          <button
            onClick={toggleDarkMode}
            className="cursor-pointer rounded-full px-6 py-1 transition-colors"
          >
            {isDark ? (
              <MdOutlineDarkMode className="text-xl" />
            ) : (
              <MdDarkMode className="text-xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="flex items-center justify-between md:hidden">
        <h1 className="cursor-pointer text-xl font-bold">Null Pointer</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleDarkMode}
            className="cursor-pointer rounded-full p-2"
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
        <div className="bg-secondary-light dark:bg-secondary-dark absolute top-full left-0 z-100 flex w-full flex-col space-y-2 py-4 shadow-lg">
          <Link href="/problems">
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-full cursor-pointer rounded-full px-6 py-2 text-left transition-colors"
            >
              Problems
            </button>
          </Link>
          <Link href="/dashboard">
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-full cursor-pointer rounded-full px-6 py-2 text-left transition-colors"
            >
              Dashboard
            </button>
          </Link>
          <Link href="/profile">
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-full cursor-pointer rounded-full px-6 py-2 text-left transition-colors"
            >
              Profile
            </button>
          </Link>
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-full cursor-pointer rounded-full px-6 py-2 text-left transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthNavbar;
