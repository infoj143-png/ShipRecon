import Link from 'next/link';
import { CTAButton } from '@/components/CTAButton';
import { StatusBadge } from '@/components/StatusBadge';

export default function HomePage() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-6 border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-slate-900"></span>
          Fast Client-Side B2B Reconciliation
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight">
          Find Supplier Shortages in Minutes
        </h1>
        <p className="mt-4 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Upload your purchase order and receiving file to quickly find short shipments, overages, missing items, and discrepancies.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <CTAButton href="/reconcile" size="lg" className="w-full sm:w-auto">
            Check Shipment
          </CTAButton>
          <CTAButton href="#how-it-works" variant="secondary" size="lg" className="w-full sm:w-auto">
            See How It Works
          </CTAButton>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 scroll-mt-20">
        <div className="border-t border-slate-200 pt-12">
          <div className="text-center mb-10">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">How It Works</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Reconcile Shipments in Three Simple Steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <div className="w-9 h-9 rounded-md bg-slate-900 text-white font-bold flex items-center justify-center text-sm mb-4">
                1
              </div>
              <h3 className="font-semibold text-slate-900 text-base">Upload your PO</h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Import your original Purchase Order or order confirmation export in CSV format.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <div className="w-9 h-9 rounded-md bg-slate-900 text-white font-bold flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h3 className="font-semibold text-slate-900 text-base">Upload your receiving file</h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Import your warehouse receiving log, delivery report, or packing slip file.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <div className="w-9 h-9 rounded-md bg-slate-900 text-white font-bold flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h3 className="font-semibold text-slate-900 text-base">Find discrepancies</h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Instantly identify shortages, missing SKUs, overages, and download a ready-to-claim discrepancy report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What ShipRecon Detects */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-xl p-8 sm:p-12 shadow-sm">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">What ShipRecon Detects</h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-2">
              Automated line-by-line comparison catches common supplier shipping and billing discrepancies.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-lg">
              <div className="text-amber-400 font-semibold text-sm mb-1">Short Shipments</div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Received quantities are lower than purchase order quantities.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-lg">
              <div className="text-rose-400 font-semibold text-sm mb-1">Missing SKUs</div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Line items on the PO with zero received units logged.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-lg">
              <div className="text-blue-400 font-semibold text-sm mb-1">Overages</div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Received quantities exceed the original purchase order amount.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-lg">
              <div className="text-purple-400 font-semibold text-sm mb-1">Unexpected SKUs</div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Items received that were not listed on the purchase order.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-lg">
              <div className="text-emerald-400 font-semibold text-sm mb-1">Matched Items</div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Items where received quantity exactly equals ordered quantity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Results Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="border border-slate-200 rounded-xl bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 mb-2">
                Demonstration Data
              </div>
              <h2 className="text-xl font-bold text-slate-900">Example Reconciliation Results</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Example of line item audit output generated by ShipRecon.
              </p>
            </div>
            <Link
              href="/reconcile"
              className="text-xs font-semibold text-slate-900 underline hover:text-slate-700"
            >
              Run live check with sample files →
            </Link>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs sm:text-sm font-mono">
              <thead className="bg-slate-100 text-slate-700 font-sans font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">SKU</th>
                  <th className="p-3 text-right">Ordered</th>
                  <th className="p-3 text-right">Received</th>
                  <th className="p-3 text-right">Difference</th>
                  <th className="p-3 font-sans">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">SKU-101</td>
                  <td className="p-3 text-right">100</td>
                  <td className="p-3 text-right">92</td>
                  <td className="p-3 text-right text-amber-700 font-semibold">-8</td>
                  <td className="p-3 font-sans">
                    <StatusBadge status="short" />
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">SKU-102</td>
                  <td className="p-3 text-right">50</td>
                  <td className="p-3 text-right">0</td>
                  <td className="p-3 text-right text-rose-700 font-semibold">-50</td>
                  <td className="p-3 font-sans">
                    <StatusBadge status="missing" />
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">SKU-103</td>
                  <td className="p-3 text-right">200</td>
                  <td className="p-3 text-right">200</td>
                  <td className="p-3 text-right text-slate-400">0</td>
                  <td className="p-3 font-sans">
                    <StatusBadge status="matched" />
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">SKU-104</td>
                  <td className="p-3 text-right">150</td>
                  <td className="p-3 text-right">160</td>
                  <td className="p-3 text-right text-blue-700 font-semibold">+10</td>
                  <td className="p-3 font-sans">
                    <StatusBadge status="over" />
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">SKU-105</td>
                  <td className="p-3 text-right">0</td>
                  <td className="p-3 text-right">25</td>
                  <td className="p-3 text-right text-purple-700 font-semibold">+25</td>
                  <td className="p-3 font-sans">
                    <StatusBadge status="unexpected" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-400 italic text-center sm:text-right">
            * Note: The table above displays example demonstration data.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center py-6">
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Check Your Shipment Before You Contact Your Supplier
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            Quickly audit purchase orders against receiving logs right in your browser with zero server data storage.
          </p>
          <div className="mt-6">
            <CTAButton href="/reconcile" size="lg">
              Check Shipment
            </CTAButton>
          </div>
        </div>
      </section>
    </div>
  );
}
