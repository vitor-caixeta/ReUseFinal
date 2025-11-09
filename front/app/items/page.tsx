// app/items/new/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, getToken } from "@/lib/api";

type FormValues = {
  title: string;
  description?: string;
  type: "doacao" | "troca" | "venda" | string;
  imageUrl?: string;
  openToTrade?: boolean;
  reason?: string;
  usageTime?: string;
  price?: string; // usamos string para facilitar a digitação
};

const navLink =
  "rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:opacity-90";

export default function NewItemPage() {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({
    title: "",
    description: "",
    type: "doacao",
    imageUrl: "",
    openToTrade: false,
    reason: "",
    usageTime: "",
    price: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<string>("");

  // Protege a rota
  useEffect(() => {
    if (!getToken()) router.replace("/login");
  }, [router]);

  const canSubmit = useMemo(() => {
    return values.title.trim().length >= 2 && !!values.type;
  }, [values]);

  function set<K extends keyof FormValues>(key: K, v: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const next: Record<string, string> = {};
    if (!values.title?.trim()) next.title = "Informe um título.";
    if (!values.type) next.type = "Selecione o tipo.";
    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      setSubmitting(true);
      const payload = {
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        type: values.type,
        imageUrl: values.imageUrl?.trim() || undefined,
        openToTrade: values.openToTrade ?? undefined,
        reason: values.reason?.trim() || undefined,
        usageTime: values.usageTime?.trim() || undefined,
        price: values.price ? Number(values.price.replace(",", ".")) : undefined,
      };

      await apiFetch("/items", {
        method: "POST",
        body: payload,
        auth: true,
      });

      router.push("/");
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, _form: err?.message || "Erro ao criar item." }));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 h-1.5 w-28 rounded-full bg-gradient-to-r from-[#368b7a] to-[#71ba82]" />
      <h1 className="text-3xl font-extrabold">Cadastrar item</h1>
      <p className="mt-1 text-sm opacity-80">
        Preencha os campos abaixo para doar, anunciar troca ou venda.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-6 space-y-5 rounded-2xl border border-zinc-200/70 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-900/60"
      >
        {/* Título */}
        <div>
          <label className="mb-1 block text-sm font-semibold">Título *</label>
          <input
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 ring-emerald-600/30 dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="Ex.: Teclado mecânico"
            required
          />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
        </div>

        {/* Tipo */}
        <div>
          <label className="mb-1 block text-sm font-semibold">Tipo *</label>
          <select
            value={values.type}
            onChange={(e) => set("type", e.target.value as FormValues["type"])}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 ring-emerald-600/30 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="doacao">Doação</option>
            <option value="troca">Troca</option>
            <option value="venda">Venda</option>
          </select>
          {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type}</p>}
        </div>

        {/* Aberto a troca */}
        <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
          <div>
            <label className="block text-sm font-semibold">Aberto a troca</label>
            <p className="text-xs opacity-70">Marque “Sim” se aceita negociar trocas.</p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2">
            <span className="text-sm">{values.openToTrade ? "Sim" : "Não"}</span>
            <input
              type="checkbox"
              checked={!!values.openToTrade}
              onChange={(e) => set("openToTrade", e.target.checked)}
              className="h-5 w-5 accent-emerald-600"
            />
          </label>
        </div>

        {/* Tempo de uso */}
        <div>
          <label className="mb-1 block text-sm font-semibold">Tempo de uso</label>
          <input
            value={values.usageTime}
            onChange={(e) => set("usageTime", e.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 ring-emerald-600/30 dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="Ex.: 6 meses, 2 anos"
          />
        </div>

        {/* Valor */}
        <div>
          <label className="mb-1 block text-sm font-semibold">Valor (R$)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={values.price}
            onChange={(e) => set("price", e.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 ring-emerald-600/30 dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="Ex.: 120.00"
          />
        </div>

        {/* Motivo */}
        <div>
          <label className="mb-1 block text-sm font-semibold">Motivo (opcional)</label>
          <textarea
            value={values.reason}
            onChange={(e) => set("reason", e.target.value)}
            className="min-h-24 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 ring-emerald-600/30 dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="Ex.: Troquei de modelo, não uso mais, etc."
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="mb-1 block text-sm font-semibold">Descrição</label>
          <textarea
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            className="min-h-28 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 ring-emerald-600/30 dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="Detalhes do estado, acessórios, etc."
          />
        </div>

        {/* Imagem (URL) */}
        <div>
          <label className="mb-1 block text-sm font-semibold">Imagem (URL)</label>
          <input
            value={values.imageUrl}
            onChange={(e) => {
              set("imageUrl", e.target.value);
              setPreview(e.target.value);
            }}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 ring-emerald-600/30 dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="https://…"
          />
          {preview?.trim() && (
            <div className="mt-3 rounded-xl border border-dashed border-zinc-300 p-3 dark:border-zinc-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Pré-visualização"
                className="max-h-56 w-full rounded-lg object-contain"
              />
            </div>
          )}
        </div>

        {/* Erros */}
        {errors._form && (
          <p className="text-sm font-medium text-red-600">{errors._form}</p>
        )}

        {/* Botões */}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className={`${navLink} bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-100`}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className={`${navLink} bg-gradient-to-r from-[#368b7a] to-[#71ba82] text-white disabled:opacity-60`}
          >
            {submitting ? "Enviando..." : "Cadastrar"}
          </button>
        </div>
      </form>
    </section>
  );
}