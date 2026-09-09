import Link from 'next/link';
import { CTAButton } from './CTAButton';

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-slate-900 text-lg tracking-tight hover:opacity-90 transition-opacity"
            >
              <span className="flex items-center justify-center w-8 h-8 bg-slate-900 text-white rounded-md text-xs font-black">
                SR
              </span>
              <span>ShipRecon</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm font-medium">
            <Link href="/reconcile" className="text-slate-600 hover:text-slate-900 transition-colors">
              Reconcile
            </Link>
            <Link href="/#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">
              How It Works
            </Link>
            <Link href="/about" className="text-slate-600 hover:text-slate-900 transition-colors">
              About
            </Link>
            <CTAButton href="/reconcile" size="sm">
              Check Shipment
            </CTAButton>
          </nav>
        </div>
      </div>
    </header>
  );
}
