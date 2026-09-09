import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-slate-500">
          <div>
            <p className="font-medium text-slate-700">Supplier Short-Shipment Reconciliation</p>
            <p className="mt-0.5">A focused business utility for comparing purchase orders and receiving logs.</p>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/reconcile" className="hover:text-slate-900 transition-colors">
              Reconcile
            </Link>
            <Link href="/about" className="hover:text-slate-900 transition-colors">
              About
            </Link>
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-slate-200 text-xs text-slate-400 text-center sm:text-left">
          &copy; {new Date().getFullYear()} Short-Ship Recon. Ready for Vercel deployment.
        </div>
      </div>
    </footer>
  );
}
