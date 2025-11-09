"use client";

import Image from "next/image";
import { useState } from "react";
import type { Item } from "@/types/item";

function currencyBRL(n?: number | null) {
  if (n == null) return null;
  try {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
  } catch { return String(n); }
}

function FallbackImg() {
  return (
    <div className="flex h-full w-full items-center justify-center text-sm opacity-70">
      sem imagem
    </div>
  );
}

function ItemModal({
  open,
  onClose,
  item,
}: {
  open: boolean;
  onClose: () => void;
  item: Item | null;
}) {
  if (!open || !item) return null;

  const isDonation = (item.type || "").toLowerCase() === "doacao";
  const priceStr = !isDonation ? currencyBRL(item.price) : "—";
  const usage = item.usageTime || "Não informado";
  const reason = item.reason || "—";
  const openTrade = item.openToTrade == null ? (item.type === "troca" ? "Sim" : "—") : (item.openToTrade ? "Sim" : "Não");

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide opacity-70">{item.type}</p>
            <h3 className="text-xl font-bold">{item.title}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-md p-1 opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
            {item.imageUrl ? (
              // para imagens remotas, configure next.config images.domains
              <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
            ) : (
              <FallbackImg />
            )}
          </div>

          <ul className="space-y-2 text-sm">
            <li className="flex justify-between gap-2">
              <span className="opacity-70">Tempo de uso</span>
              <span className="font-medium">{usage}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="opacity-70">Aberto a troca</span>
              <span className="font-medium">{openTrade}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="opacity-70">Valor</span>
              <span className="font-medium">{priceStr}</span>
            </li>
            <li className="pt-2">
              <p className="mb-1 text-xs font-semibold opacity-70">Motivo (opcional)</p>
              <p className="text-sm leading-relaxed">{reason}</p>
            </li>
          </ul>
        </div>

        {item.description && (
          <div className="mt-4 rounded-lg bg-zinc-50 p-3 text-sm leading-relaxed dark:bg-zinc-800/60">
            {item.description}
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-gradient-to-r from-[#368b7a] to-[#71ba82] px-4 py-2 text-sm font-semibold text-white"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ItemsGridClient({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Item | null>(null);

  return (
    <>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <article
            key={it.id}
            className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
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
              <button
                onClick={() => { setCurrent(it); setOpen(true); }}
                className="absolute bottom-3 left-3 rounded-lg bg-gradient-to-r from-[#368b7a] to-[#71ba82] px-3 py-1.5 text-xs font-semibold text-white shadow-md"
              >
                Explore
              </button>
            </div>

            <div className="p-4">
              <p className="text-xs uppercase tracking-wide opacity-70">{it.type}</p>
              <h3 className="truncate text-lg font-semibold">{it.title}</h3>
            </div>
          </article>
        ))}
      </div>

      <ItemModal open={open} onClose={() => setOpen(false)} item={current} />
    </>
  );
}
