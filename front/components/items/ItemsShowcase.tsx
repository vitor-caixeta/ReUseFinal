import ItemsGridClient from "./ItemsShowcaseClient";
import type { Item } from "@/types/item";
export const dynamic = "force-dynamic";

function normalizeItem(it: any): Item {
  return {
    id: it.id,
    title: it.title,
    description: it.description ?? "",
    type: it.type,
    imageUrl: it.imageUrl ?? null,
    usageTime: it.usageTime ?? null,
    reason: it.reason ?? null,
    price: it.price ?? null,
    openToTrade: it.openToTrade ?? (it.type === "troca" ? true : null),
  };
}

async function fetchItems(): Promise<Item[]> {
  // Se estiver em dev local, usa o backend local.
  // Se houver variável NEXT_PUBLIC_API_BASE_URL, usa ela.
  const API_BASE =
    // process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://reuse-final-back-production.up.railway.app";


  try {
    const res = await fetch(`${API_BASE}/items`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as any[];
    return data.map(normalizeItem);
  } catch (e) {
    console.error("Erro ao buscar itens:", e);
    return [];
  }
}

export default async function ItemsShowcase() {
  const items = await fetchItems();

  // filtra por títulos únicos e pega só 6
  const seen = new Set<string>();
  const unique = items
    .filter((it) => {
      const key = (it.title || "").trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 6);

  return <ItemsGridClient items={unique} />;
}
