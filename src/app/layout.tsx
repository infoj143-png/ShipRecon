import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Chatbot } from '@/components/Chatbot';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const defaultSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ship-recon.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(defaultSiteUrl),
  title: {
    default: 'Supplier Short-Shipment Checker | ShipRecon',
    template: '%s',
  },
  description:
    'Check purchase orders against receiving files to find supplier short shipments, missing items, overages, and delivery discrepancies. Free browser-based tool.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Supplier Short-Shipment Checker | ShipRecon',
    description:
      'Check purchase orders against receiving files to find supplier short shipments, missing items, overages, and delivery discrepancies. Free browser-based tool.',
    url: '/',
    siteName: 'ShipRecon',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Supplier Short-Shipment Checker | ShipRecon',
    description:
      'Check purchase orders against receiving files to find supplier short shipments, missing items, overages, and delivery discrepancies. Free browser-based tool.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ShipRecon',
  url: defaultSiteUrl,
  logo: `${defaultSiteUrl}/favicon.ico`,
  description: 'Supplier short-shipment reconciliation utility for comparing purchase orders and receiving logs.',
};

const softwareApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'ShipRecon',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'All',
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
  url: defaultSiteUrl,
  description:
    'Browser-based B2B utility to compare purchase orders against receiving files and identify supplier short shipments, missing SKUs, overages, and discrepancies.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
