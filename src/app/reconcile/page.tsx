import type { Metadata } from 'next';
import { ReconcileClient } from './ReconcileClient';

export const metadata: Metadata = {
  title: 'Supplier Short-Shipment Reconciliation Tool | ShipRecon',
  description:
    'Compare your purchase order with your receiving file and instantly identify short shipments, missing SKUs, overages, and unexpected items.',
  alternates: {
    canonical: '/reconcile',
  },
  openGraph: {
    title: 'Supplier Short-Shipment Reconciliation Tool | ShipRecon',
    description:
      'Compare your purchase order with your receiving file and instantly identify short shipments, missing SKUs, overages, and unexpected items.',
    url: '/reconcile',
    siteName: 'ShipRecon',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Supplier Short-Shipment Reconciliation Tool | ShipRecon',
    description:
      'Compare your purchase order with your receiving file and instantly identify short shipments, missing SKUs, overages, and unexpected items.',
  },
};

export default function ReconcilePage() {
  return <ReconcileClient />;
}
