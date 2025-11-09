import ItemsGridClient from "./ItemsShowcaseClient";
import type { Item } from "@/types/item";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

async function fetchItems(): Promise<Item[]> {
  const res = await fetch(`${API_BASE}/items`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = (await res.json()) as any[];
  // normaliza campos opcionais se vierem ausentes
  return data.map((it) => ({
    id: it.id,
    title: it.title,
    description: it.description ?? "",
    type: it.type,
    imageUrl: it.imageUrl ?? null,
    usageTime: it.usageTime ?? null,
    reason: it.reason ?? null,
    price: it.price ?? null,
    openToTrade: it.openToTrade ?? (it.type === "troca" ? true : null),
  })) as Item[];
}

export default async function ItemsShowcase() {
  const items = await fetchItems();

  // filtra por títulos únicos e pega só 6
  const seen = new Set<string>();
  const unique = items.filter((it) => {
    const key = (it.title || "").trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 6);

  return <ItemsGridClient items={unique} />;
}
