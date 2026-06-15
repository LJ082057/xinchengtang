"use client";
import { useState, useEffect } from "react";

export default function HeaderBg() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`fixed inset-x-0 top-0 z-40 h-14 transition-all duration-base ${scrolled ? "bg-xuan-card/95 backdrop-blur-md shadow-lg shadow-black/20" : "bg-transparent"}`} />
  );
}
