"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Item } from "@/app/shop/page";

function currencyBRL(n?: number | null) {
  if (n == null) return null;
  try {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
  } catch {
    return String(n);
  }
}

function FallbackImg() {
  return (
    <div className="flex h-full w-full items-center justify-center text-xs opacity-60">
      sem imagem
    </div>
  );
}

export default function ShopClient({ items }: { items: Item[] }) {
  const [q, setQ] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter((it) => it.title?.toLowerCase().includes(term));
  }, [q, items]);

  function handleMessageClick() {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000); // desaparece em 3s
  }

  return (
    <>
      {/* Alerta de sucesso */}
      {showAlert && (
        <div className="fixed top-5 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-medium text-white shadow-md animate-fade-in-out">
          Mensagem enviada! Logo ele(a) entrará em contato. Obrigado!
        </div>
      )}

      {/* Barra de pesquisa */}
      <div className="mt-6 flex items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 ring-emerald-600/30 dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="Pesquisar por nome…"
          aria-label="Pesquisar por nome"
        />
        <span className="text-sm opacity-70">{filtered.length} resultado(s)</span>
      </div>

      {/* Grid de cards */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((it) => (
          <article
            key={it.id}
            className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="relative aspect-[4/3]">
              {it.imageUrl ? (
                <Image
                  src={it.imageUrl}
                  alt={it.title}
                  fill
                  className="object-cover transition group-hover:scale-[1.02]"
                />
              ) : (
                <FallbackImg />
              )}
            </div>

            <div className="p-4">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide opacity-70">{it.type}</p>
                {it.price != null && (
                  <span className="text-sm font-semibold">{currencyBRL(it.price)}</span>
                )}
              </div>
              <h3 className="line-clamp-1 text-lg font-semibold">{it.title}</h3>
              {it.description && (
                <p className="mt-1 line-clamp-2 text-sm opacity-80">{it.description}</p>
              )}

              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleMessageClick}
                  className="rounded-lg bg-gradient-to-r from-[#368b7a] to-[#71ba82] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition active:scale-[0.98]"
                >
                  Mandar mensagem
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Animação simples */}
      <style jsx global>{`
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translate(-50%, -10px); }
          10% { opacity: 1; transform: translate(-50%, 0); }
          90% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -10px); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 3s ease-in-out;
        }
      `}</style>
    </>
  );
}
