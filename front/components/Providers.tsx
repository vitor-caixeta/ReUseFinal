// components/Providers.tsx
"use client";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"   // 👈 troque para data-theme
      defaultTheme="light"
      enableSystem={false}
      themes={["light", "dark"]} // nomes que seu CSS espera
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
