// app/shop/page.tsx
import ShopClient from "@/components/shop/ShopClient";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export type Item = {
  id: number;
  title: string;
  description?: string | null;
  type: "doacao" | "troca" | "venda" | string;
  imageUrl?: string | null;
  price?: number | null;
  user?: { id: number; name: string };
};

async function getItems(): Promise<Item[]> {
  const res = await fetch(`${API_BASE}/items`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function ShopPage() {
  const items = await getItems();

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 h-1.5 w-28 rounded-full bg-gradient-to-r from-[#368b7a] to-[#71ba82]" />
      <h1 className="text-3xl font-extrabold">Shop</h1>
      <p className="mt-1 text-sm opacity-80">Busque por nome e explore os itens disponíveis.</p>

      <ShopClient items={items} />
    </section>
  );
}
