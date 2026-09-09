import type { Metadata } from 'next';
import Link from 'next/link';
import { CTAButton } from '@/components/CTAButton';
import { getPostBySlug } from '@/lib/blog';

const defaultSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shiprecon.com';

export const metadata: Metadata = {
  title: 'Supplier Short Shipment: How to Find, Calculate, and Document Shortages | ShipRecon',
  description:
    'Learn how to identify, calculate, and document supplier short shipments by comparing ordered and received quantities.',
  alternates: {
    canonical: '/blog/supplier-short-shipment',
  },
  openGraph: {
    title: 'Supplier Short Shipment: How to Find, Calculate, and Document Shortages | ShipRecon',
    description:
      'Learn how to identify, calculate, and document supplier short shipments by comparing ordered and received quantities.',
    url: '/blog/supplier-short-shipment',
    siteName: 'ShipRecon',
    type: 'article',
    locale: 'en_US',
    publishedTime: '2025-03-01T00:00:00.000Z',
    modifiedTime: '2025-03-01T00:00:00.000Z',
  },
  twitter: {
    card: 'summary',
    title: 'Supplier Short Shipment: How to Find, Calculate, and Document Shortages | ShipRecon',
    description:
      'Learn how to identify, calculate, and document supplier short shipments by comparing ordered and received quantities.',
  },
};

export default function ArticlePage() {
  const post = getPostBySlug('supplier-short-shipment');

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Supplier Short Shipment: How to Find, Calculate, and Document Shortages',
    description:
      'Learn how to identify, calculate, and document supplier short shipments by comparing ordered and received quantities.',
    datePublished: '2025-03-01',
    dateModified: '2025-03-01',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${defaultSiteUrl}/blog/supplier-short-shipment`,
    },
    author: {
      '@type': 'Organization',
      name: 'ShipRecon',
      url: defaultSiteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ShipRecon',
      url: defaultSiteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${defaultSiteUrl}/favicon.ico`,
      },
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a supplier short shipment?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A supplier short shipment occurs when a vendor delivers fewer goods than specified on the purchase order.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do you calculate a short shipment?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Subtract the received quantity from the ordered quantity (Ordered Quantity − Received Quantity = Shortage Quantity). Multiply by unit price for shortage value.',
        },
      },
      {
        '@type': 'Question',
        name: 'What should I do if a supplier delivers less than ordered?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Verify counts, compare PO vs receiving logs, record the discrepancy, preserve documentation, and notify the vendor to request credit or replacement.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between ordered quantity and received quantity?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ordered quantity is the number of units requested on the purchase order; received quantity is the actual physical count received at the dock.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I document a supplier shortage?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Capture PO number, supplier name, SKU, ordered vs received counts, shortage quantity, unit price, receiving date, and attach signed receiving slips or photos.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-10 text-slate-800">
        {/* Navigation & Header */}
        <div>
          <Link
            href="/blog"
            className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1 mb-4"
          >
            &larr; Back to Resources
          </Link>
          <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
            <time dateTime="2025-03-01">{post?.formattedDate || 'March 1, 2025'}</time>
            <span>&bull;</span>
            <span>{post?.readTime || '6 min read'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Supplier Short Shipment: How to Find, Calculate, and Document Shortages
          </h1>
        </div>

        {/* Introduction */}
        <section className="prose prose-slate max-w-none space-y-4 text-sm sm:text-base leading-relaxed">
          <p className="text-slate-700">
            A supplier short shipment happens whenever a vendor delivers fewer items than specified on your purchase order.
            Whether caused by warehouse stockouts, picking errors, packing oversight, or transit losses, receiving incomplete orders directly impacts operations, order fulfillment schedules, and cash flow.
          </p>
          <div className="bg-slate-100 border-l-4 border-slate-900 p-4 rounded-r-md my-4">
            <p className="font-semibold text-slate-900 text-sm">Practical Example:</p>
            <p className="text-slate-700 text-xs sm:text-sm mt-1">
              Your purchase order requests <strong>100 units</strong> of an item, but your warehouse team logs only <strong>92 units</strong> delivered on the packing slip.
              Your business faces an <strong>8-unit shortage</strong> that must be identified, recorded, and documented before approving invoices or closing the receiving process.
            </p>
          </div>
        </section>

        <hr className="border-slate-200" />

        {/* H2 — What Is a Supplier Short Shipment? */}
        <section className="space-y-4 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            What Is a Supplier Short Shipment?
          </h2>
          <p className="text-slate-700">
            A <strong>supplier short shipment</strong> is a partial delivery where the physical quantity delivered is less than the quantity requested in the agreed purchase order (PO).
          </p>
          <p className="text-slate-700">
            When managing purchasing and inventory across multiple vendors, distinguishing between <em>ordered quantity</em> (the agreed commercial commitment) and <em>received quantity</em> (the actual inventory logged at receiving) is critical. Shortages occur for a range of operational reasons:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700 text-xs sm:text-sm">
            <li><strong>Supplier stock depletion:</strong> The vendor ran out of stock for specific SKUs at picking time.</li>
            <li><strong>Fulfillment error:</strong> Warehouse staff miscounted or omitted boxes during staging or loading.</li>
            <li><strong>Damage or loss in transit:</strong> Freight carriers damaged cartons or lost packages before delivery.</li>
            <li><strong>Backorders:</strong> The supplier intentionally shipped a partial order with plans to deliver the remainder later without clear notification.</li>
          </ul>
          <p className="text-slate-700">
            Logging shortages promptly prevents accounting teams from paying full invoice amounts for goods your company never received.
          </p>
        </section>

        <hr className="border-slate-200" />

        {/* H2 — How to Tell If a Supplier Short-Shipped Your Order */}
        <section className="space-y-4 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            How to Tell If a Supplier Short-Shipped Your Order
          </h2>
          <p className="text-slate-700">
            Identifying a short shipment requires a direct comparison between line items on the Purchase Order and line items on the Receiving Report.
          </p>

          <div className="overflow-x-auto border border-slate-200 rounded-lg my-4">
            <table className="w-full text-left text-xs sm:text-sm font-mono">
              <thead className="bg-slate-100 text-slate-900 font-sans font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">SKU</th>
                  <th className="p-3 text-right">Ordered</th>
                  <th className="p-3 text-right">Received</th>
                  <th className="p-3 text-right">Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">SKU-101</td>
                  <td className="p-3 text-right">100</td>
                  <td className="p-3 text-right">92</td>
                  <td className="p-3 text-right text-amber-700 font-bold">-8</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">SKU-102</td>
                  <td className="p-3 text-right">50</td>
                  <td className="p-3 text-right">50</td>
                  <td className="p-3 text-right text-slate-500">0</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">SKU-103</td>
                  <td className="p-3 text-right">25</td>
                  <td className="p-3 text-right">30</td>
                  <td className="p-3 text-right text-blue-700 font-bold">+5</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-slate-700">
            Understanding the difference column:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700 text-xs sm:text-sm">
            <li><strong className="text-amber-800">Negative Difference (-8):</strong> Indicates a <strong>shortage</strong>. The supplier shipped 8 fewer units than ordered.</li>
            <li><strong className="text-slate-800">Zero Difference (0):</strong> Indicates a <strong>perfect match</strong>. The received quantity exactly equals the ordered quantity.</li>
            <li><strong className="text-blue-800">Positive Difference (+5):</strong> Indicates an <strong>overage</strong>. The supplier shipped 5 extra units beyond the purchase order amount.</li>
          </ul>
        </section>

        <hr className="border-slate-200" />

        {/* H2 — Supplier Short Shipment Example */}
        <section className="space-y-4 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Supplier Short Shipment Example
          </h2>
          <p className="text-slate-700">
            Consider a typical e-commerce or retail operations scenario:
          </p>
          <div className="bg-white border border-slate-200 p-5 rounded-lg space-y-3 text-xs sm:text-sm">
            <div className="grid grid-cols-2 gap-2 border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-900">Purchase Order (PO #4501):</span>
              <span className="text-slate-700 text-right font-mono">100 units</span>
            </div>
            <div className="grid grid-cols-2 gap-2 border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-900">Warehouse Receiving Log:</span>
              <span className="text-slate-700 text-right font-mono">92 units</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <span className="font-bold text-slate-900">Discrepancy (Shortage):</span>
              <span className="font-bold text-amber-700 text-right font-mono">-8 units</span>
            </div>
          </div>
          <p className="text-slate-700">
            Upon discovering this 8-unit shortage during receiving:
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-slate-700 text-xs sm:text-sm">
            <li>The receiving clerk notes the 8-unit variance on the carrier bill of lading (BOL) and packing slip before signing.</li>
            <li>The receiving team takes photos of the pallet condition or outer carton labels if shipping damage or tampering is suspected.</li>
            <li>The internal record is updated to show 92 units available for inventory, avoiding ghost stock in inventory management systems.</li>
            <li>The purchasing or accounts payable team is alerted to hold payment for the 8 missing units until a credit memo or replacement shipment is issued.</li>
          </ol>
        </section>

        <hr className="border-slate-200" />

        {/* H2 — How to Calculate a Supplier Shortage */}
        <section className="space-y-4 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            How to Calculate a Supplier Shortage
          </h2>
          <p className="text-slate-700">
            Calculating a short shipment involves two simple steps: determining the physical shortage quantity and estimating the monetary value of the missing goods.
          </p>

          <div className="bg-slate-900 text-white p-5 rounded-lg space-y-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">1. Quantity Shortage Formula</p>
              <p className="font-mono text-base font-bold text-amber-300 mt-1">Shortage Quantity = Ordered Quantity − Received Quantity</p>
              <p className="text-xs text-slate-300 mt-1">Example: 100 − 92 = 8 units short</p>
            </div>
            <div className="pt-3 border-t border-slate-800">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">2. Shortage Value Formula</p>
              <p className="font-mono text-base font-bold text-emerald-300 mt-1">Shortage Value = Shortage Quantity × Unit Price</p>
              <p className="text-xs text-slate-300 mt-1">Example: 8 × $10 = $80 shortage value</p>
            </div>
          </div>

          <p className="text-slate-700 text-xs sm:text-sm">
            <em>Note:</em> The calculated shortage value provides an estimated monetary claim based on the unit cost recorded on the purchase order. Always verify whether the supplier invoiced for the full PO amount or adjusted line items on their final invoice.
          </p>
        </section>

        <hr className="border-slate-200" />

        {/* H2 — What to Do When a Supplier Ships Less Than Ordered */}
        <section className="space-y-4 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            What to Do When a Supplier Ships Less Than Ordered
          </h2>
          <p className="text-slate-700">
            When receiving less than ordered, follow a clear standard operating procedure (SOP) to ensure claims are processed smoothly:
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white border border-slate-200 p-4 rounded-lg">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">1</span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Check the original purchase order</h3>
                <p className="text-slate-600 text-xs mt-0.5">Confirm the exact SKU, quantity ordered, and unit price specified in your approved PO.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white border border-slate-200 p-4 rounded-lg">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">2</span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Inspect the supplier packing slip</h3>
                <p className="text-slate-600 text-xs mt-0.5">Check whether the packing slip indicates a backorder, split shipment, or full order fulfillment.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white border border-slate-200 p-4 rounded-lg">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">3</span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Count the actual received quantity</h3>
                <p className="text-slate-600 text-xs mt-0.5">Perform a physical recount at the receiving dock before moving inventory into active warehouse bins.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white border border-slate-200 p-4 rounded-lg">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">4</span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Compare ordered vs received quantities</h3>
                <p className="text-slate-600 text-xs mt-0.5">Calculate the exact unit variance for each line item on the delivery.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white border border-slate-200 p-4 rounded-lg">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">5</span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Record the shortage in receiving logs</h3>
                <p className="text-slate-600 text-xs mt-0.5">Log actual received counts in your WMS or ERP system to prevent inventory inflation.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white border border-slate-200 p-4 rounded-lg">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">6</span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Preserve supporting documentation</h3>
                <p className="text-slate-600 text-xs mt-0.5">Keep signed delivery slips, bill of lading notations, carton labels, and dock photos.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white border border-slate-200 p-4 rounded-lg">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">7</span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Contact the supplier</h3>
                <p className="text-slate-600 text-xs mt-0.5">Send a clear discrepancy notification attaching the PO number, receiving date, and item shortage report.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white border border-slate-200 p-4 rounded-lg">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">8</span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Request appropriate resolution</h3>
                <p className="text-slate-600 text-xs mt-0.5">Request an expedited replacement shipment, a revised invoice, or a credit memo for the missing items.</p>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-slate-200" />

        {/* H2 — How to Document a Supplier Shortage */}
        <section className="space-y-4 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            How to Document a Supplier Shortage
          </h2>
          <p className="text-slate-700">
            Suppliers and freight carriers require complete, unambiguous documentation before issuing credit memos or processing claims. Ensure your receiving logs capture:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700 text-xs sm:text-sm">
            <li><strong>Purchase Order Number (PO #)</strong> and internal job/order reference.</li>
            <li><strong>Supplier name</strong> and vendor code.</li>
            <li><strong>SKU / Item Code</strong> and product description.</li>
            <li><strong>Ordered quantity</strong> vs <strong>received quantity</strong>.</li>
            <li><strong>Shortage quantity</strong> (negative unit variance).</li>
            <li><strong>Unit price</strong> and estimated total shortage value.</li>
            <li><strong>Receiving date</strong> and receiving dock location.</li>
            <li><strong>Supporting documents</strong> (signed BOL, packing slip, carrier tracking number).</li>
            <li><strong>Specific notes</strong> regarding box condition, broken seals, or missing cartons.</li>
          </ul>
          <p className="text-slate-700">
            Maintaining structured records turns subjective vendor claims into objective data, drastically speeding up credit approvals and vendor reconciliations.
          </p>
        </section>

        <hr className="border-slate-200" />

        {/* H2 — Purchase Order vs Receiving Report */}
        <section className="space-y-4 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Purchase Order vs Receiving Report
          </h2>
          <p className="text-slate-700">
            A key operational practice in inventory management is comparing <strong>Purchase Orders</strong> against <strong>Receiving Reports</strong>:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2 text-xs sm:text-sm">
            <div className="bg-white border border-slate-200 p-4 rounded-lg">
              <h3 className="font-bold text-slate-900 text-base mb-1">Purchase Order (PO)</h3>
              <p className="text-slate-600">Issued by purchasing to state what the business <em>ordered</em>, including expected quantities, agreed unit prices, and delivery dates.</p>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-lg">
              <h3 className="font-bold text-slate-900 text-base mb-1">Receiving Report</h3>
              <p className="text-slate-600">Logged at the warehouse dock to record what physically <em>arrived</em>, including received counts, condition notes, and delivery timestamps.</p>
            </div>
          </div>
          <p className="text-slate-700">
            Comparing these two independent records line-by-line reveals critical discrepancies across your supply chain:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700 text-xs sm:text-sm">
            <li><strong>Short shipments:</strong> Missing units on ordered lines.</li>
            <li><strong>Missing SKUs:</strong> Ordered items completely missing from the delivery.</li>
            <li><strong>Overages:</strong> Items delivered in excess of ordered quantities.</li>
            <li><strong>Unexpected SKUs:</strong> Unordered items included in shipment boxes.</li>
            <li><strong>Matched items:</strong> Accurately delivered inventory ready for receiving approval.</li>
          </ul>
        </section>

        <hr className="border-slate-200" />

        {/* H2 — How to Check Supplier Shipments Automatically */}
        <section className="space-y-4 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            How to Check Supplier Shipments Automatically
          </h2>
          <p className="text-slate-700">
            Manual line-by-line spreadsheet comparisons across hundreds of SKUs are tedious and prone to human error.
          </p>
          <p className="text-slate-700">
            <strong>ShipRecon</strong> helps you compare a purchase order with a receiving file and quickly identify shipment discrepancies directly in your browser.
          </p>
          <p className="text-slate-700">
            By simply uploading your Purchase Order file and Warehouse Receiving CSV or XLSX export, ShipRecon automatically categorizes every line item into:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-3 text-xs font-medium text-slate-800">
            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded text-center">Short Shipments</div>
            <div className="bg-rose-50 border border-rose-200 p-2.5 rounded text-center">Missing SKUs</div>
            <div className="bg-blue-50 border border-blue-200 p-2.5 rounded text-center">Overages</div>
            <div className="bg-purple-50 border border-purple-200 p-2.5 rounded text-center">Unexpected SKUs</div>
            <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded text-center col-span-2 sm:col-span-1">Matched Items</div>
          </div>

          <div className="bg-slate-100 border border-slate-200 rounded-xl p-6 sm:p-8 text-center my-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Audit Purchase Orders Against Receiving Logs
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-lg mx-auto">
              Run a fast, browser-based comparison with instant CSV export for supplier credit requests. No account setup required.
            </p>
            <div className="mt-5">
              <CTAButton href="/reconcile" size="lg">
                Check Your Shipment with ShipRecon
              </CTAButton>
            </div>
          </div>
        </section>

        <hr className="border-slate-200" />

        {/* H2 — Frequently Asked Questions */}
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <div className="bg-white border border-slate-200 p-5 rounded-lg space-y-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                What is a supplier short shipment?
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                A supplier short shipment occurs when a vendor delivers fewer goods than specified on the purchase order.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-lg space-y-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                How do you calculate a short shipment?
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Subtract the received quantity from the ordered quantity (Ordered Quantity − Received Quantity = Shortage Quantity). To estimate shortage value, multiply Shortage Quantity by the item’s unit price.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-lg space-y-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                What should I do if a supplier delivers less than ordered?
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Verify counts on the dock, note variances on the delivery receipt, preserve photos/documentation, log the received counts in your system, and send a structured discrepancy report to the supplier to request replacement or credit.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-lg space-y-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                What is the difference between ordered quantity and received quantity?
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Ordered quantity is the number of units requested on the purchase order. Received quantity is the physical count logged by receiving personnel when the order arrives.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-lg space-y-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                How do I document a supplier shortage?
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Capture PO number, supplier name, SKU/item codes, ordered vs received quantities, shortage amounts, unit prices, receiving date, notes on shipment condition, and attached delivery documents.
              </p>
            </div>
          </div>
        </section>

        {/* Footer Navigation CTA */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
          <Link href="/blog" className="text-slate-600 hover:text-slate-900 font-medium underline">
            &larr; View all resources
          </Link>
          <Link href="/reconcile" className="text-slate-900 font-bold hover:underline">
            Go to Reconcile Tool &rarr;
          </Link>
        </div>
      </article>
    </>
  );
}
