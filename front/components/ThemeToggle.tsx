"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const isDark = resolvedTheme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-full px-4 py-2 bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
    >
      {isDark ? "☀️ Claro" : "🌙 Escuro"}
    </button>
  );
}
