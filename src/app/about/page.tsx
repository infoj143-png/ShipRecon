import type { Metadata } from 'next';
import { CTAButton } from '@/components/CTAButton';

export const metadata: Metadata = {
  title: 'About | ShipRecon - Supplier Short-Shipment Reconciliation',
  description: 'Learn about ShipRecon, a lightweight B2B web utility designed to quickly reconcile purchase orders and receiving logs.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About ShipRecon
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
          A focused B2B web utility designed to solve a costly, everyday operational problem: supplier short shipments.
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">The Operational Problem</h2>
          <p>
            When businesses order inventory from suppliers, receiving docks log what physically arrives, while accounting receives an invoice for what was originally ordered.
            Discrepancies often go unnoticed when manually comparing spreadsheets line-by-line across hundreds of SKUs. Over time, paying for short-shipped or missing goods erodes operating margins.
          </p>
        </section>

        <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">The ShipRecon Solution</h2>
          <p>
            ShipRecon provides an instant, lightweight reconciliation workflow. By uploading standard Purchase Order and Receiving CSV exports, procurement and warehouse teams can immediately pinpoint quantity deficits, zero-received line items, overages, and unexpected items.
          </p>
        </section>

        <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">Built for Speed and Data Privacy</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li>
              <strong className="text-slate-900">Speed & Simplicity:</strong> No complex onboarding, account setup, ERP configuration, or software installation required.
            </li>
            <li>
              <strong className="text-slate-900">Data Privacy First:</strong> All reconciliation processing is executed client-side in your web browser. Your confidential purchasing and commercial data remains entirely on your machine.
            </li>
            <li>
              <strong className="text-slate-900">Actionable Exports:</strong> Generates clean CSV discrepancy reports formatted to send directly to vendor credit teams.
            </li>
          </ul>
        </section>

        <div className="pt-4 text-center">
          <CTAButton href="/reconcile" size="lg">
            Start Reconciliation
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
