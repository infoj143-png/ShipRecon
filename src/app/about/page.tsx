export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          About Supplier Short-Shipment Reconciliation
        </h1>
        <p className="text-slate-600 text-sm mt-2 leading-relaxed">
          A focused B2B web utility designed to solve a costly, everyday operational problem: short shipments.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">The Problem</h2>
          <p>
            When businesses order inventory from suppliers, receiving docks log what physically arrives, while accounting receives an invoice for what was originally ordered.
            Discrepancies often go unnoticed when matching manual spreadsheets line-by-line across hundreds of SKUs. Over time, paying for short-shipped or missing goods erodes profit margins.
          </p>
        </section>

        <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">The Solution</h2>
          <p>
            This tool provides a lightweight, instant reconciliation workflow. By uploading standard Purchase Order and Receiving CSV exports, warehouse and procurement teams can instantly pinpoint quantity deficits, zero-received line items, overages, and unexpected items.
          </p>
        </section>

        <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Key Principles</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><strong>Speed & Simplicity:</strong> No complex onboarding, account setup, or ERP configuration needed.</li>
            <li><strong>Data Privacy:</strong> File reconciliation is executed client-side in your browser. Your commercial data stays local.</li>
            <li><strong>Actionable Outputs:</strong> Standardized CSV exports designed to be attached directly to vendor credit claim emails.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
