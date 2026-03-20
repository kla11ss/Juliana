import { AdminDashboard } from "@/components/admin-dashboard";
import { listLeads } from "@/lib/leads";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient();
  try {
    const leads = await listLeads(supabase);

    return <AdminDashboard initialLeads={leads} />;
  } catch (error) {
    return (
      <div className="simple-page__card">
        <p className="section-kicker">Mini-CRM</p>
        <h1>База ещё не инициализирована</h1>
        <p>
          Supabase подключён, но таблицы CRM пока не созданы. Нужно выполнить SQL из{" "}
          <code>supabase/schema.sql</code>, после чего заявки появятся в админке.
        </p>
        <p className="form-error">
          {error instanceof Error ? error.message : "Не удалось загрузить заявки."}
        </p>
      </div>
    );
  }
}
