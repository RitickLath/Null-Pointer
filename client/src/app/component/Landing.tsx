"use client";

import Image from "next/image";
import { techIcons } from "../constant/techIcons";
import FloatingIcon from "./FloatingIcon";
import { useEffect, useState } from "react";

const Landing = () => {
  const [isDark, setIsDark] = useState(
    typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const backgroundStyle = {
    backgroundImage: `
      linear-gradient(to right, ${isDark ? "var(--color-secondary-border-dark)" : "var(--color-secondary-border-light)"} 1px, transparent 1px),
      linear-gradient(to bottom, ${isDark ? "var(--color-secondary-border-dark)" : "var(--color-secondary-border-light)"} 1px, transparent 1px)
    `,
    backgroundSize: "50px 50px",
  };

  return (
    <div
      className="relative flex h-[80dvh] w-full items-center justify-center text-center"
      style={backgroundStyle}
    >
      {/* Floating icons */}
      {techIcons.map((icon, index) => (
        <FloatingIcon key={index} classname={icon.position}>
          <Image
            src={icon.src}
            width={40}
            height={40}
            alt={icon.alt}
            className="h-full w-full"
          />
        </FloatingIcon>
      ))}

      {/* Main Content */}
      <div className="max-w-[500px] lg:max-w-[600px]">
        <div className="relative">
          <h1 className="pb-1 text-3xl font-semibold tracking-wider md:text-5xl lg:pb-3">
            We love coding
            <span className="absolute -top-3 -right-4 rounded-t-full rounded-r-full bg-red-400 px-3 py-1 text-sm tracking-normal text-white">
              Not really <br />
              actually...
            </span>
          </h1>
          <h2 className="pb-1 text-3xl font-semibold tracking-wider sm:text-4xl md:text-5xl lg:pb-3">
            But, what if there is also
          </h2>
          <h2 className="pb-1 text-3xl font-semibold tracking-wider sm:text-4xl md:text-5xl lg:pb-3">
            AI that helps you code?
          </h2>

          <p
            className={`max-w-[400px] pt-4 md:max-w-[550px] ${isDark ? "text-secondary-text-dark" : "text-secondary-text-light"}`}
          >
            Practice real interview questions, improve your problem-solving
            skills with AI assistance and become a confident developer, one
            challenge at a time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
