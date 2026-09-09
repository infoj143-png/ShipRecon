import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ShipRecon | Supplier Short-Shipment Reconciliation Utility',
  description:
    'Find supplier shortages in minutes. Upload your purchase order and receiving file to quickly identify short shipments, overages, missing items, and discrepancies.',
  openGraph: {
    title: 'ShipRecon - Fast Supplier Short-Shipment Reconciliation',
    description:
      'Upload purchase orders and receiving logs to audit short shipments, overages, and missing SKUs instantly in your browser.',
    type: 'website',
    locale: 'en_US',
    siteName: 'ShipRecon',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
