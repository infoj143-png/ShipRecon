'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface HelpGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
  actionText?: string;
  actionHref?: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How do I start / Where can I check my shipment?',
    answer: 'Tap Check Shipment or open Reconcile to compare your purchase order with your receiving file.',
    actionText: 'Go to Check Shipment',
    actionHref: '/reconcile',
  },
  {
    question: 'How does ShipRecon work?',
    answer: 'Open How It Works from the mobile menu to see the three-step process for finding shortages.',
    actionText: 'See How It Works',
    actionHref: '/#how-it-works',
  },
  {
    question: 'Where is the Blog?',
    answer: 'Open the mobile menu and select Blog to read operational guides and supply chain articles.',
    actionText: 'Explore Blog',
    actionHref: '/blog',
  },
  {
    question: 'Where can I learn more about ShipRecon?',
    answer: 'Open About from the mobile menu to learn about our browser-based reconciliation tool.',
    actionText: 'Read About Us',
    actionHref: '/about',
  },
];

export function HelpGuide({ isOpen, onClose }: HelpGuideProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 bg-slate-900 text-white rounded-full text-xs font-bold">
              ?
            </span>
            <h2 id="help-modal-title" className="text-base font-bold text-slate-900">
              Help & Navigation Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close help guide"
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm font-semibold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 text-sm">
          <p className="text-xs text-slate-500 mb-2">
            Quick navigation help to find tools, resources, and information on ShipRecon.
          </p>

          <div className="space-y-2">
            {FAQ_ITEMS.map((item, idx) => {
              const isExpanded = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-lg overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isExpanded ? null : idx)}
                    aria-expanded={isExpanded}
                    className="w-full text-left p-3 font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100/80 flex justify-between items-center text-xs sm:text-sm gap-2"
                  >
                    <span>{item.question}</span>
                    <span className="text-slate-400 text-xs shrink-0 font-bold">
                      {isExpanded ? '−' : '+'}
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="p-3 bg-white text-xs sm:text-sm text-slate-600 border-t border-slate-100 space-y-2">
                      <p className="leading-relaxed">{item.answer}</p>
                      {item.actionText && item.actionHref && (
                        <div>
                          <Link
                            href={item.actionHref}
                            onClick={onClose}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:underline pt-1"
                          >
                            <span>{item.actionText}</span>
                            <span>→</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Tool-first client-side utility</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800 transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
