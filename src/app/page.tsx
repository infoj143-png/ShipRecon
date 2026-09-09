import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mb-6 border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-slate-900"></span>
          Focused B2B Reconciliation Utility
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight">
          Find Supplier Shortages in Minutes
        </h1>
        <p className="mt-4 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Upload your purchase order and receiving file to instantly find short shipments, overages, missing SKUs, and quantity discrepancies.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/reconcile"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
          >
            Check Shipment
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-white border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            See How It Works
          </a>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 pt-8">
        <div className="border-t border-slate-200 pt-12">
          <div className="text-center mb-10">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Simple 3-Step Workflow</h2>
            <p className="text-2xl font-bold text-slate-900 mt-1">Reconcile Shipments Without Manual Spreadsheets</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <div className="w-9 h-9 rounded-md bg-slate-900 text-white font-bold flex items-center justify-center text-sm mb-4">
                1
              </div>
              <h3 className="font-semibold text-slate-900 text-base">Upload Files</h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Import your original Purchase Order file alongside your Receiving Slip or Packing list in standard CSV format.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <div className="w-9 h-9 rounded-md bg-slate-900 text-white font-bold flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h3 className="font-semibold text-slate-900 text-base">Map Columns</h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Confirm your SKU, Quantity, and optional Price columns so our matching engine processes the data accurately.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <div className="w-9 h-9 rounded-md bg-slate-900 text-white font-bold flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h3 className="font-semibold text-slate-900 text-base">Export Discrepancies</h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Instantly view categorized line items, dollar impact values, and download a ready-to-claim discrepancy report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What The Tool Detects */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-slate-900 text-white rounded-xl p-8 sm:p-12 shadow-sm">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">What The Tool Detects</h2>
            <p className="text-slate-300 text-sm mt-2">
              Automated line-by-line comparison catches common vendor errors before accounts payable settles invoices.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-lg">
              <div className="text-amber-400 font-semibold text-sm mb-1">Short Shipments</div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Quantities received are lower than the purchase order quantity requested.
              </p>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-lg">
              <div className="text-rose-400 font-semibold text-sm mb-1">Missing SKUs</div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Entire line items listed on the purchase order with zero recorded units on the receiving document.
              </p>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-lg">
              <div className="text-blue-400 font-semibold text-sm mb-1">Quantity Overages</div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Received quantities exceed the original ordered quantity.
              </p>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-lg">
              <div className="text-purple-400 font-semibold text-sm mb-1">Unexpected SKUs</div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Items received that were never present on the original purchase order.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Results Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="border border-slate-200 rounded-xl bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Example Reconciliation Summary</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Clear financial summary showing unfulfilled quantities and financial impact.
              </p>
            </div>
            <Link
              href="/reconcile"
              className="text-xs font-semibold text-slate-900 underline hover:text-slate-700"
            >
              Try with sample data →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Shortage Value</p>
              <p className="text-lg font-bold text-rose-700 mt-1">$3,225.00</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Short / Missing</p>
              <p className="text-lg font-bold text-amber-700 mt-1">3 SKUs</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Matched Lines</p>
              <p className="text-lg font-bold text-emerald-700 mt-1">2 SKUs</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Unexpected Lines</p>
              <p className="text-lg font-bold text-purple-700 mt-1">1 SKU</p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 text-slate-700 font-sans font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">SKU</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right">Ordered</th>
                  <th className="p-2.5 text-right">Received</th>
                  <th className="p-2.5 text-right">Difference</th>
                  <th className="p-2.5 text-right">Shortage Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2.5 font-semibold text-slate-900">SKU-1002</td>
                  <td className="p-2.5 font-sans">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                      Shortage
                    </span>
                  </td>
                  <td className="p-2.5 text-right">250</td>
                  <td className="p-2.5 text-right">200</td>
                  <td className="p-2.5 text-right text-amber-700 font-semibold">-50</td>
                  <td className="p-2.5 text-right font-semibold text-slate-900">$2,250.00</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-slate-900">SKU-1004</td>
                  <td className="p-2.5 font-sans">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                      Missing SKU
                    </span>
                  </td>
                  <td className="p-2.5 text-right">80</td>
                  <td className="p-2.5 text-right">0</td>
                  <td className="p-2.5 text-right text-amber-700 font-semibold">-80</td>
                  <td className="p-2.5 text-right font-semibold text-slate-900">$8,800.00</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-slate-900">SKU-1001</td>
                  <td className="p-2.5 font-sans">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Matched
                    </span>
                  </td>
                  <td className="p-2.5 text-right">500</td>
                  <td className="p-2.5 text-right">500</td>
                  <td className="p-2.5 text-right text-slate-400">0</td>
                  <td className="p-2.5 text-right text-slate-400">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why Use It */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-slate-200 bg-white p-6 rounded-lg">
            <h3 className="font-semibold text-slate-900 text-sm">Protect Profit Margins</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Unchecked short shipments directly erode operating margins when invoices are paid for goods never received.
            </p>
          </div>
          <div className="border border-slate-200 bg-white p-6 rounded-lg">
            <h3 className="font-semibold text-slate-900 text-sm">Speed Up Credit Claims</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Generate instant CSV reports detailing line-item missing quantities to send directly to vendors for quick credit memos.
            </p>
          </div>
          <div className="border border-slate-200 bg-white p-6 rounded-lg">
            <h3 className="font-semibold text-slate-900 text-sm">Zero Setup Required</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              No software installation or complicated ERP integration required. Just upload CSV files and check discrepancies.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center py-6">
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-slate-900">Ready to audit your incoming shipment?</h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            Process your purchase orders and receiving logs locally in your browser with complete privacy.
          </p>
          <div className="mt-6">
            <Link
              href="/reconcile"
              className="inline-flex items-center justify-center rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
            >
              Check Shipment Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
