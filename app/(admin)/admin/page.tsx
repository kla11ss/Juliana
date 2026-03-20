import { AdminDashboard } from "@/components/admin-dashboard";
import { listLeads } from "@/lib/leads";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const leads = await listLeads();

  return <AdminDashboard initialLeads={leads} />;
}
