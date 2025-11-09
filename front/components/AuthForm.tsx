"use client";

import { useState } from "react";
import TextField from "@/components/ui/TextField";
import Link from "next/link";
import { apiFetch, setToken } from "@/lib/api";
import { useRouter } from "next/navigation";


type Field = {
  label: string;
  name: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
};

type Props = {
  title: string;
  subtitle?: string;
  fields: Field[];
  submitLabel: string;
  footer?: React.ReactNode;
  onSubmit?: (values: Record<string, string>) => Promise<void> | void;
};

export default function AuthForm({ title, subtitle, fields, submitLabel, footer, onSubmit }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const values: Record<string, string> = {};
    fields.forEach((f) => (values[f.name] = String(formData.get(f.name) ?? "")));

    const nextErrors: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.required && !values[f.name]) nextErrors[f.name] = "Campo obrigatório.";
      if (f.type === "email" && values[f.name] && !/.+@.+\..+/.test(values[f.name]))
        nextErrors[f.name] = "E-mail inválido.";
      if (f.name === "password" && values[f.name] && values[f.name].length < 6)
        nextErrors[f.name] = "Mínimo de 6 caracteres.";
    });

    setErrors(nextErrors);
        setFormError(null);
        if (Object.keys(nextErrors).length) return;

        try {
        setLoading(true);
        await onSubmit?.(values);
        } catch (err: any) {
        setFormError(err?.message || "Algo deu errado.");
        } finally {
        setLoading(false);
        }
    }

  
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-6 h-1.5 w-24 rounded-full bg-gradient-to-r from-[#368b7a] to-[#71ba82]" />
      <h1 className="text-2xl font-extrabold">{title}</h1>
      {subtitle && <p className="mt-1 text-sm opacity-80">{subtitle}</p>}

      <form onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-2xl border border-zinc-200/70 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-900/60">
        {fields.map((f) => (
          <TextField
            key={f.name}
            label={f.label}
            name={f.name}
            type={f.type}
            placeholder={f.placeholder}
            autoComplete={f.autoComplete}
            required={f.required}
          />
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-[#368b7a] to-[#71ba82] px-4 py-2.5 text-center text-sm font-bold text-white shadow-sm transition active:scale-[0.99] disabled:opacity-60"
        >
          {loading ? "Enviando..." : submitLabel}
        </button>
      </form>

      {footer && (
        <div className="mt-4 text-center text-sm opacity-90">
          {footer}
        </div>
      )}
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();

  return (
    <AuthForm
      title="Entrar"
      subtitle="Acesse sua conta para continuar."
      submitLabel="Entrar"
      fields={[
        { label: "E-mail", name: "email", type: "email", placeholder: "voce@email.com", autoComplete: "email", required: true },
        { label: "Senha", name: "password", type: "password", placeholder: "Sua senha", autoComplete: "current-password", required: true },
      ]}
      footer={<>Não tem conta? <Link href="/register" className="font-semibold text-[#368b7a] hover:opacity-90">Cadastre-se</Link></>}
      onSubmit={async (values) => {
        const data = await apiFetch<{ token: string; user: any }>("/auth/login", {
          method: "POST",
          body: values,
        });
        setToken(data.token);     
        router.push("/");         
      }}
    />
  );
}

export function RegisterForm() {
  const router = useRouter();

  return (
    <AuthForm
      title="Criar conta"
      subtitle="Leva menos de um minuto."
      submitLabel="Cadastrar"
      fields={[
        { label: "Nome", name: "name", placeholder: "Seu nome", autoComplete: "name", required: true },
        { label: "E-mail", name: "email", type: "email", placeholder: "voce@email.com", autoComplete: "email", required: true },
        { label: "Senha", name: "password", type: "password", placeholder: "Crie uma senha", autoComplete: "new-password", required: true },
      ]}
      footer={<>Já tem conta? <Link href="/login" className="font-semibold text-[#368b7a] hover:opacity-90">Entrar</Link></>}
      onSubmit={async (values) => {
        const data = await apiFetch<{ token: string; user: any }>("/auth/register", {
          method: "POST",
          body: values,
        });
        setToken(data.token);    
        router.push("/");        
      }}
    />
  );
}
