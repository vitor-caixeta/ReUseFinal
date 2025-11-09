"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import { getToken, clearToken } from "@/lib/api";

const navLink =
  "relative rounded-full px-4 py-2 text-base font-semibold transition hover:opacity-90";
const ghost = "bg-transparent";
const solid = "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [logged, setLogged] = useState(false);
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    setLogged(!!getToken());

    const handler = () => setLogged(!!getToken());
    const storageHandler = (e: StorageEvent) => {
      if (e.key === "token") handler();
    };

    window.addEventListener("auth:changed", handler);
    window.addEventListener("storage", storageHandler);
    return () => {
      window.removeEventListener("auth:changed", handler);
      window.removeEventListener("storage", storageHandler);
    };
  }, []);

  // Fecha menu ao trocar rota
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // item ativo para underline animado
  const activeHref = useMemo(
    () => navItems.find((n) => isActive(n.href))?.href,
    [pathname]
  );

  return (
    <motion.header
      className="fixed top-0 z-40 w-full border-b border-transparent bg-transparent backdrop-blur-sm"
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.7 }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <motion.div layout>
          <Link href="/" className="text-2xl font-black tracking-tight">
            ReUse
          </Link>
        </motion.div>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          <nav className="relative flex gap-2">
            {navItems.map((it) => (
              <motion.div key={it.href} className="relative">
                <Link
                  href={it.href}
                  className={`${navLink} ${ghost} ${
                    isActive(it.href) ? "opacity-100" : "opacity-70"
                  }`}
                >
                  {it.label}
                </Link>
                {/* underline animado compartilhado */}
                {isActive(it.href) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-4 right-4 -bottom-[2px] h-[2px] rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, #368b7a 0%, #71ba82 100%)",
                      opacity: 0.95,
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
              </motion.div>
            ))}
          </nav>

          {/* Ações */}
          <div className="flex items-center gap-3">
            {!logged ? (
              <>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/login"
                    className={`${navLink} bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-100`}
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Link href="/register" className={`${navLink} ${solid}`}>
                    Registrar
                  </Link>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Link href="/items" className={`${navLink} ${solid}`}>
                    Cadastrar item
                  </Link>
                </motion.div>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/profile"
                    className={`${navLink} bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-100`}
                  >
                    Meu perfil
                  </Link>
                </motion.div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    clearToken();
                    router.push("/");
                    try {
                      window.dispatchEvent(new Event("auth:changed"));
                    } catch {}
                  }}
                  className={`${navLink} bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-100`}
                >
                  Sair
                </motion.button>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile: botão hambúrguer */}
        <motion.button
          aria-label="Abrir menu"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200/70 bg-white/70 text-zinc-700 shadow-sm backdrop-blur transition hover:opacity-90 active:scale-[0.98] dark:border-zinc-800/70 dark:bg-zinc-900/60 dark:text-zinc-200"
          onClick={() => setOpen((v) => !v)}
          whileTap={{ scale: 0.96 }}
        >
          {/* ícone animado */}
          <motion.span
            className="relative block h-[2px] w-5 rounded-full bg-current"
            animate={open ? { rotate: 45 } : { rotate: 0 }}
            transition={{ duration: 0.18 }}
          >
            <motion.span
              className="absolute left-0 top-[-6px] block h-[2px] w-5 rounded-full bg-current"
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.18 }}
            />
            <motion.span
              className="absolute left-0 top-[6px] block h-[2px] w-5 rounded-full bg-current"
              animate={open ? { rotate: -90, top: 0 } : { rotate: 0, top: 6 }}
              transition={{ duration: 0.18 }}
            />
          </motion.span>
        </motion.button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="mobileMenu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 pb-4 pt-2">
              <nav className="flex flex-col gap-1">
                {navItems.map((it) => (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={`${navLink} ${ghost} ${
                      isActive(it.href) ? "opacity-100" : "opacity-80"
                    }`}
                  >
                    <span className="relative">
                      {it.label}
                      {activeHref === it.href && (
                        <motion.span
                          layoutId="mobile-underline"
                          className="absolute left-0 right-0 -bottom-1 h-[2px] rounded-full"
                          style={{
                            background:
                              "linear-gradient(90deg, #368b7a 0%, #71ba82 100%)",
                          }}
                        />
                      )}
                    </span>
                  </Link>
                ))}
              </nav>

              <div className="mt-2 flex flex-col gap-2">
                {!logged ? (
                  <>
                    <Link
                      href="/login"
                      className={`${navLink} bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-100`}
                    >
                      Login
                    </Link>
                    <Link href="/register" className={`${navLink} ${solid}`}>
                      Registrar
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/items" className={`${navLink} ${solid}`}>
                      Cadastrar item
                    </Link>
                    <Link
                      href="/profile"
                      className={`${navLink} bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-100`}
                    >
                      Meu perfil
                    </Link>
                    <button
                      onClick={() => {
                        clearToken();
                        router.push("/");
                        try {
                          window.dispatchEvent(new Event("auth:changed"));
                        } catch {}
                      }}
                      className={`${navLink} bg-zinc-100 text-left dark:bg-zinc-800 dark:text-zinc-100`}
                    >
                      Sair
                    </button>
                  </>
                )}

                <div className="pt-1">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
