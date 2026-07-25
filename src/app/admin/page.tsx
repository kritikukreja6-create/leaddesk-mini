import dbConnect from "@/lib/db";
import Lead from "@/models/Lead";
import { LeadsTable } from "@/components/admin/leads-table";
import { LogoutButton } from "@/components/admin/logout-button";
import type { ILead } from "@/models/Lead";

export default async function AdminPage() {
  await dbConnect();

  const leads = await Lead.find().sort({ createdAt: -1 }).lean();

  const serializedLeads = leads.map((lead) => ({
    ...lead,
    _id: String(lead._id),
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  })) as (ILead & { _id: string })[];

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
            <p className="text-muted-foreground mt-1">
              {serializedLeads.length} total submission
              {serializedLeads.length !== 1 ? "s" : ""}
            </p>
          </div>
          <LogoutButton />
        </div>

        <LeadsTable initialLeads={serializedLeads} />
      </div>
    </main>
  );
}
