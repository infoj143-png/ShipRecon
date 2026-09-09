export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Privacy Policy</h1>
        <p className="text-slate-600 text-sm mt-2">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm">
        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-2">1. Client-Side Data Processing</h2>
          <p>
            The Supplier Short-Shipment Reconciliation tool processes your uploaded files (Purchase Orders and Receiving logs) directly within your web browser using JavaScript. Your files and row data are not uploaded, saved, or transmitted to any external backend server or database in this version.
          </p>
        </section>

        <section className="pt-4 border-t border-slate-100">
          <h2 className="text-base font-semibold text-slate-900 mb-2">2. Data Storage</h2>
          <p>
            We do not store your trade secrets, pricing info, SKU lists, supplier names, or purchasing logs in any remote database. All session data resides in your browser&apos;s temporary runtime memory and is cleared when you refresh or navigate away from the page.
          </p>
        </section>

        <section className="pt-4 border-t border-slate-100">
          <h2 className="text-base font-semibold text-slate-900 mb-2">3. Cookies and Tracking</h2>
          <p>
            We do not use advertising tracking cookies, third-party user profiling scripts, or intrusive analytics on this web application.
          </p>
        </section>

        <section className="pt-4 border-t border-slate-100">
          <h2 className="text-base font-semibold text-slate-900 mb-2">4. Contact Information</h2>
          <p>
            For questions regarding this privacy policy or tool usage, please visit our website support page.
          </p>
        </section>
      </div>
    </div>
  );
}
