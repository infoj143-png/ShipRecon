import Link from 'next/link';

export function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2.5 font-semibold text-slate-900 text-lg tracking-tight">
              <span className="flex items-center justify-center w-8 h-8 bg-slate-900 text-white rounded-md font-bold text-sm">
                SR
              </span>
              <span>Short-Ship Recon</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/reconcile" className="text-slate-600 hover:text-slate-900 transition-colors">
              Reconcile
            </Link>
            <Link href="/about" className="text-slate-600 hover:text-slate-900 transition-colors">
              About
            </Link>
            <Link href="/privacy" className="text-slate-600 hover:text-slate-900 transition-colors">
              Privacy
            </Link>
            <Link
              href="/reconcile"
              className="inline-flex items-center justify-center rounded-md bg-slate-900 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
            >
              Check Shipment
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
