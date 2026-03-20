import Link from "next/link";

import { ApplyWizard } from "@/components/apply-wizard";

export default function ApplyPage() {
  return (
    <main className="subpage-shell">
      <div className="subpage-topbar">
        <Link className="eyebrow-pill eyebrow-pill--ghost" href="/">
          На главную
        </Link>
      </div>
      <ApplyWizard />
    </main>
  );
}
