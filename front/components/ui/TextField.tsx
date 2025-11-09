"use client";
import clsx from "clsx";

type Props = {
  id?: string;
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  className?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export default function TextField({
  id, label, name, type = "text", placeholder, className,
  autoComplete, required, disabled, defaultValue, onChange,
}: Props) {
  // ID determinístico: derive do name, NÃO use useId se houver renderização condicional acima
  const stableId = id ?? `field-${name}`;

  const base =
    "w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none " +
    "focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900";

  return (
    <div className="w-full">
      <label htmlFor={stableId} className="mb-1 block text-sm text-zinc-600 dark:text-zinc-300">
        {label}
      </label>
      <div className="relative">
        <input
          id={stableId}
          name={name}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          onChange={onChange}
          className={clsx(base, className)}
        />
      </div>
    </div>
  );
}
