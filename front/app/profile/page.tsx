"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiFetch, getToken } from "@/lib/api";
import SmartImage from "@/components/SmartImage";


type Me = {
  id: number;
  name: string;
  email: string;
  city?: string | null;
  age?: number | null;
  level: number;
  createdAt: string;
  avatarUrl?: string | null;
};

type Item = {
  id: number;
  title: string;
  description?: string | null;
  type: "doacao" | "troca" | "venda" | string;
  imageUrl?: string | null;
  usageTime?: string | null;
  reason?: string | null;
  price?: number | null;
  openToTrade?: boolean | null;
  user?: { id: number; name: string };
};

const band = "bg-gradient-to-r from-[#368b7a] to-[#71ba82]";
const btn = "rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:opacity-90";

export default function ProfilePage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<{
    name: string;
    city: string;
    age: string;
    avatarUrl: string;
  }>({ name: "", city: "", age: "", avatarUrl: "" });

  const [items, setItems] = useState<Item[]>([]);
  const [edit, setEdit] = useState<Item | null>(null);
  const [savingItem, setSavingItem] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itemError, setItemError] = useState<string | null>(null);

  // Protege a rota
  useEffect(() => {
    if (!getToken()) router.replace("/login");
  }, [router]);

  // Carrega perfil e itens do usuário
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [meRes, itemsRes] = await Promise.all([
          apiFetch<Me>("/me", { auth: true }),
          apiFetch<Item[]>("/items"),
        ]);
        if (!mounted) return;

        setMe(meRes);
        setForm({
          name: meRes.name || "",
          city: meRes.city || "",
          age: meRes.age != null ? String(meRes.age) : "",
          avatarUrl: meRes.avatarUrl || "",
        });

        // filtra só os itens do usuário
        const myItems = (itemsRes || []).filter((it) => it.user?.id === meRes.id);
        setItems(myItems);
      } catch (e: any) {
        setError(e?.message || "Falha ao carregar perfil.");
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const createdAtStr = useMemo(() => {
    if (!me?.createdAt) return "";
    try {
      const d = new Date(me.createdAt);
      return d.toLocaleDateString("pt-BR");
    } catch { return ""; }
  }, [me]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      setSaving(true);
      const body: any = {
        name: form.name.trim(),
        city: form.city.trim() || null,
        age: form.age ? Number(form.age) : null,
        avatarUrl: form.avatarUrl?.trim() || null,
      };
      // PATCH /me (esperado no backend)
      const updated = await apiFetch<Me>("/me", { method: "PATCH", body, auth: true });
      setMe(updated);
    } catch (e: any) {
      setError(e?.message || "Erro ao salvar perfil.");
    } finally {
      setSaving(false);
    }
  }

  function openEdit(item: Item) {
    setItemError(null);
    setEdit({ ...item });
  }

  async function saveItem(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    setItemError(null);
    try {
      setSavingItem(true);
      const body: any = {
        title: edit.title?.trim(),
        description: edit.description?.trim() || null,
        type: edit.type,
        imageUrl: edit.imageUrl?.trim() || null,
        usageTime: edit.usageTime?.trim() || null,
        reason: edit.reason?.trim() || null,
        openToTrade: edit.openToTrade ?? null,
        price: edit.price ?? null,
      };
      // PUT /items/:id (esperado no backend)
      const updated = await apiFetch<Item>(`/items/${edit.id}`, {
        method: "PUT",
        body,
        auth: true,
      });

      // atualiza na lista local
      setItems((prev) => prev.map((it) => (it.id === updated.id ? { ...it, ...updated } : it)));
      setEdit(null);
    } catch (e: any) {
      setItemError(e?.message || "Erro ao salvar item.");
    } finally {
      setSavingItem(false);
    }
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-10">
        <div className="h-1.5 w-28 rounded-full bg-gradient-to-r from-[#368b7a] to-[#71ba82]" />
        <p className="mt-6 text-sm opacity-80">Carregando perfil…</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <div className={`mb-6 h-1.5 w-28 rounded-full ${band}`} />

      <h1 className="text-3xl font-extrabold">Meu perfil</h1>
      <p className="mt-1 text-sm opacity-80">
        Conta criada em {createdAtStr} • Nível {me?.level}
      </p>

      {/* Perfil */}
      <form
        onSubmit={saveProfile}
        className="mt-6 grid gap-6 rounded-2xl border border-zinc-200/70 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-900/60 sm:grid-cols-[160px_1fr]"
      >
        {/* Avatar */}
        <div className="space-y-3">
          <div className="relative h-40 w-40 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
            {form.avatarUrl ? (
                <SmartImage src={form.avatarUrl} alt="Foto de perfil" fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs opacity-60">
                Sem foto
              </div>
            )}
          </div>
          <input
            value={form.avatarUrl}
            onChange={(e) => setForm((s) => ({ ...s, avatarUrl: e.target.value }))}
            className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-transparent focus:ring-2 ring-emerald-600/30 dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="URL da foto (https://...)"
          />
        </div>

        {/* Dados */}
        <div className="grid gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold">Nome</label>
            <input
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 ring-emerald-600/30 dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="Seu nome"
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold">Cidade</label>
              <input
                value={form.city}
                onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 ring-emerald-600/30 dark:border-zinc-700 dark:bg-zinc-900"
                placeholder="Ex.: Caldas Novas"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Idade</label>
              <input
                type="number"
                min={1}
                value={form.age}
                onChange={(e) => setForm((s) => ({ ...s, age: e.target.value }))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 ring-emerald-600/30 dark:border-zinc-700 dark:bg-zinc-900"
                placeholder="Ex.: 18"
              />
            </div>
          </div>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className={`${btn} ${band} text-white disabled:opacity-60`}
            >
              {saving ? "Salvando..." : "Salvar perfil"}
            </button>
          </div>
        </div>
      </form>

      {/* Meus Itens */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold">Meus itens</h2>
        <p className="text-sm opacity-80">Gerencie seus cadastros.</p>

        {items.length === 0 ? (
          <div className="mt-4 rounded-xl border border-zinc-200 p-4 text-sm opacity-70 dark:border-zinc-800">
            Você ainda não cadastrou itens.
          </div>
        ) : (
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it) => (
              <article
                key={it.id}
                className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="relative aspect-[4/3]">
                  {it.imageUrl ? (
                    <Image src={it.imageUrl} alt={it.title} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs opacity-60">
                      Sem imagem
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase tracking-wide opacity-70">{it.type}</p>
                  <h3 className="truncate text-lg font-semibold">{it.title}</h3>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => openEdit(it)}
                      className={`${btn} bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-100`}
                    >
                      Editar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Modal de edição de item */}
      {edit && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 sm:items-center"
          onClick={() => setEdit(null)}
        >
          <form
            onSubmit={saveItem}
            className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-4">
              <h3 className="text-xl font-bold">Editar item</h3>
              <button
                type="button"
                onClick={() => setEdit(null)}
                aria-label="Fechar"
                className="rounded-md p-1 opacity-70 hover:opacity-100"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-3">
              <label className="text-sm font-semibold">Título</label>
              <input
                value={edit.title || ""}
                onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 ring-emerald-600/30 dark:border-zinc-700 dark:bg-zinc-900"
                required
              />

              <label className="mt-2 text-sm font-semibold">Tipo</label>
              <select
                value={edit.type}
                onChange={(e) => setEdit({ ...edit, type: e.target.value as Item["type"] })}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 ring-emerald-600/30 dark:border-zinc-700 dark:bg-zinc-900"
              >
                <option value="doacao">Doação</option>
                <option value="troca">Troca</option>
                <option value="venda">Venda</option>
              </select>

              <label className="mt-2 text-sm font-semibold">Imagem (URL)</label>
              <input
                value={edit.imageUrl || ""}
                onChange={(e) => setEdit({ ...edit, imageUrl: e.target.value })}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 ring-emerald-600/30 dark:border-zinc-700 dark:bg-zinc-900"
              />

              <label className="mt-2 text-sm font-semibold">Descrição</label>
              <textarea
                value={edit.description || ""}
                onChange={(e) => setEdit({ ...edit, description: e.target.value })}
                className="min-h-24 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 ring-emerald-600/30 dark:border-zinc-700 dark:bg-zinc-900"
              />

              {/* Extras (seu schema suportar) */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold">Tempo de uso</label>
                  <input
                    value={edit.usageTime || ""}
                    onChange={(e) => setEdit({ ...edit, usageTime: e.target.value })}
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 ring-emerald-600/30 dark:border-zinc-700 dark:bg-zinc-900"
                    placeholder="Ex.: 6 meses"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">Aberto a troca</label>
                  <div className="mt-2">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={!!edit.openToTrade}
                        onChange={(e) => setEdit({ ...edit, openToTrade: e.target.checked })}
                        className="h-5 w-5 accent-emerald-600"
                      />
                      <span>{edit.openToTrade ? "Sim" : "Não"}</span>
                    </label>
                  </div>
                </div>
              </div>

              <label className="mt-2 text-sm font-semibold">Motivo (opcional)</label>
              <textarea
                value={edit.reason || ""}
                onChange={(e) => setEdit({ ...edit, reason: e.target.value })}
                className="min-h-20 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 ring-emerald-600/30 dark:border-zinc-700 dark:bg-zinc-900"
              />

              <label className="mt-2 text-sm font-semibold">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={edit.price ?? ""}
                onChange={(e) => setEdit({ ...edit, price: e.target.value ? Number(e.target.value) : null })}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 ring-emerald-600/30 dark:border-zinc-700 dark:bg-zinc-900"
                placeholder="Ex.: 120.00"
              />
            </div>

            {itemError && <p className="mt-3 text-sm font-medium text-red-600">{itemError}</p>}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEdit(null)}
                className={`${btn} bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-100`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={savingItem}
                className={`${btn} ${band} text-white disabled:opacity-60`}
              >
                {savingItem ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
