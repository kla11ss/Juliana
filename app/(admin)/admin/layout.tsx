import { redirect } from "next/navigation";

import { signOutAdmin } from "@/app/(admin)/admin/actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  if (!isSupabaseConfigured) {
    return (
      <main className="simple-page">
        <div className="simple-page__card">
          <p className="section-kicker">Mini-CRM</p>
          <h1>Нужна настройка окружения</h1>
          <p>
            Для работы админки нужно заполнить <code>.env.local</code> переменными Supabase и
            Telegram, а затем применить SQL-схему из <code>supabase/schema.sql</code>.
          </p>
        </div>
      </main>
    );
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="section-kicker">Mini-CRM</p>
          <h1>Заявки Ульяны Гойхман</h1>
        </div>

        <form action={signOutAdmin}>
          <button className="button button--ghost" type="submit">
            Выйти
          </button>
        </form>
      </header>
      {children}
    </main>
  );
}
