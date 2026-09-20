import { LoginForm } from "@/components/organisms/LoginForm/LoginForm";

export default function CmsLoginPage() {
  return (
    <main className="cms-scope flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <LoginForm />
      </div>
    </main>
  );
}
