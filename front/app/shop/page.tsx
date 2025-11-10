// app/shop/page.tsx
import ShopClient from "@/components/shop/ShopClient";
export const dynamic = "force-dynamic";

export type Item = {
  id: number;
  title: string;
  description?: string | null;
  type: "doacao" | "troca" | "venda" | string;
  imageUrl?: string | null;
  price?: number | null;
  user?: { id: number; name: string };
};

// Use env em prod; em dev cai para localhost
const RAW_BASE =
  // process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://reuse-final-back-production.up.railway.app";


const API_BASE = RAW_BASE.replace(/\/+$/, "");

async function tryFetch(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status} em ${url}`);
  return (await res.json()) as Item[];
}

async function getItems(): Promise<Item[]> {
  const candidates = [
    `${API_BASE}/items`,
    `${API_BASE}/api/index/items`,
  ];

  for (const url of candidates) {
    try {
      return await tryFetch(url);
    } catch (e) {
      // segue para o próximo candidato
    }
  }

  // se nenhum funcionar, evita quebrar a página
  return [];
}

export default async function ShopPage() {
  const items = await getItems();

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 h-1.5 w-28 rounded-full bg-gradient-to-r from-[#368b7a] to-[#71ba82]" />
      <h1 className="text-3xl font-extrabold">Shop</h1>
      <p className="mt-1 text-sm opacity-80">
        Busque por nome e explore os itens disponíveis.
      </p>

      <ShopClient items={items} />
    </section>
  );
}
