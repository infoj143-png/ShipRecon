import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | ShipRecon',
  description: 'ShipRecon processes all files client-side in your browser. Read our privacy policy.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-2">
          Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm">
        <section>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-2">1. Client-Side Data Processing</h2>
          <p>
            ShipRecon processes all uploaded files (Purchase Orders and Receiving logs) directly within your web browser using JavaScript. Your files and row data are not transmitted to, uploaded to, or stored on any external server or database.
          </p>
        </section>

        <section className="pt-4 border-t border-slate-100">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-2">2. Data Storage & Confidentiality</h2>
          <p>
            We do not store your trade secrets, unit pricing, SKU catalog, vendor information, or order history. All session state exists exclusively in temporary browser memory during your active session and is discarded upon page reload or window closure.
          </p>
        </section>

        <section className="pt-4 border-t border-slate-100">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-2">3. Cookies & Tracking Scripts</h2>
          <p>
            ShipRecon does not utilize third-party advertising cookies, cross-site trackers, or intrusive analytics scripts.
          </p>
        </section>

        <section className="pt-4 border-t border-slate-100">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-2">4. Technical Inquiries</h2>
          <p>
            For technical questions regarding ShipRecon software architecture or data security, please contact our engineering team via our main website.
          </p>
        </section>
      </div>
    </div>
  );
}
