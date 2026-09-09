'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CTAButton } from './CTAButton';
import { HelpGuide } from './HelpGuide';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-2">
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-2 font-bold text-slate-900 text-lg tracking-tight hover:opacity-90 transition-opacity"
            >
              <span className="flex items-center justify-center w-8 h-8 bg-slate-900 text-white rounded-md text-xs font-black">
                SR
              </span>
              <span>ShipRecon</span>
            </Link>
          </div>

          {/* Desktop Navigation (md and above) */}
          <nav
            aria-label="Desktop Navigation"
            className="hidden md:flex items-center space-x-5 text-sm font-medium"
          >
            <Link href="/" className="text-slate-600 hover:text-slate-900 transition-colors shrink-0">
              Home
            </Link>
            <Link href="/reconcile" className="text-slate-600 hover:text-slate-900 transition-colors shrink-0">
              Reconcile
            </Link>
            <Link href="/blog" className="text-slate-600 hover:text-slate-900 transition-colors shrink-0">
              Blog
            </Link>
            <Link href="/#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors shrink-0">
              How It Works
            </Link>
            <Link href="/about" className="text-slate-600 hover:text-slate-900 transition-colors shrink-0">
              About
            </Link>
            <CTAButton href="/reconcile" size="sm" className="shrink-0">
              Check Shipment
            </CTAButton>
          </nav>

          {/* Mobile Right Action Bar (< md) */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/"
              onClick={closeMenu}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-2 py-1 rounded transition-colors"
            >
              Home
            </Link>

            <button
              type="button"
              onClick={() => setIsHelpOpen(true)}
              aria-label="Open Help and Navigation Guide"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <span className="w-4 h-4 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">
                ?
              </span>
              <span>Help</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <span>{isMenuOpen ? '✕' : '☰'}</span>
              <span>Menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel (< md) */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-slate-200 bg-white shadow-lg animate-in slide-in-from-top-2 duration-150"
        >
          <div className="px-4 py-4 space-y-3">
            <div className="pb-2 border-b border-slate-100">
              <CTAButton
                href="/reconcile"
                size="md"
                className="w-full justify-center"
                onClick={closeMenu}
              >
                Check Shipment
              </CTAButton>
            </div>

            <nav aria-label="Mobile Navigation" className="flex flex-col space-y-1 font-medium text-sm">
              <Link
                href="/reconcile"
                onClick={closeMenu}
                className="px-3 py-2.5 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <span>Reconcile Tool</span>
                <span className="text-slate-400 text-xs">→</span>
              </Link>
              <Link
                href="/blog"
                onClick={closeMenu}
                className="px-3 py-2.5 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <span>Blog & Resources</span>
                <span className="text-slate-400 text-xs">→</span>
              </Link>
              <Link
                href="/#how-it-works"
                onClick={closeMenu}
                className="px-3 py-2.5 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <span>How It Works</span>
                <span className="text-slate-400 text-xs">→</span>
              </Link>
              <Link
                href="/about"
                onClick={closeMenu}
                className="px-3 py-2.5 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <span>About ShipRecon</span>
                <span className="text-slate-400 text-xs">→</span>
              </Link>
              <Link
                href="/privacy"
                onClick={closeMenu}
                className="px-3 py-2.5 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <span>Privacy Policy</span>
                <span className="text-slate-400 text-xs">→</span>
              </Link>
            </nav>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  setIsHelpOpen(true);
                }}
                className="text-slate-600 hover:text-slate-900 font-semibold underline"
              >
                Need help navigating?
              </button>
              <span>ShipRecon v1.0</span>
            </div>
          </div>
        </div>
      )}

      {/* Help Guide Modal */}
      <HelpGuide isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </header>
  );
}
