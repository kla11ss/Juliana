import Link from "next/link";

import { AdminLoginForm } from "@/components/admin-login-form";

export default function AdminLoginPage() {
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return (
    <main className="simple-page">
      <div className="simple-page__card simple-page__card--narrow">
        <Link className="eyebrow-pill eyebrow-pill--ghost" href="/">
          На главную
        </Link>
        <p className="section-kicker">Admin access</p>
        <h1>Вход в mini-CRM</h1>
        <p>
          Введите рабочий email, который приглашён в Supabase Auth. На почту придёт magic link для
          безопасного входа.
        </p>
        {!isSupabaseConfigured ? (
          <p className="form-error">
            Supabase env пока не настроены. После заполнения <code>.env.local</code> вход заработает
            без дополнительных правок.
          </p>
        ) : null}
        <AdminLoginForm />
      </div>
    </main>
  );
}
