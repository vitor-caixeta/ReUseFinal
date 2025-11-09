import { LoginForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-6xl items-center justify-center px-4 py-10">
      <div className="w-full">
        <LoginForm />
      </div>
    </section>
  );
}
