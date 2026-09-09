import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Supplier & Receiving Resources | ShipRecon',
  description:
    'Practical guides for supplier short shipments, purchase order reconciliation, receiving discrepancies, and ordered vs received quantities.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Supplier & Receiving Resources | ShipRecon',
    description:
      'Practical guides for supplier short shipments, purchase order reconciliation, receiving discrepancies, and ordered vs received quantities.',
    url: '/blog',
    siteName: 'ShipRecon',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Supplier & Receiving Resources | ShipRecon',
    description:
      'Practical guides for supplier short shipments, purchase order reconciliation, receiving discrepancies, and ordered vs received quantities.',
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <header className="border-b border-slate-200 pb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Supplier Shipping & Receiving Resources
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed max-w-2xl">
          ShipRecon publishes practical resources for checking purchase orders, receiving quantities, supplier shortages, and delivery discrepancies.
        </p>
      </header>

      <section className="space-y-6" aria-label="Articles">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
              <time dateTime={post.datePublished}>{post.formattedDate}</time>
              <span>&bull;</span>
              <span>{post.readTime}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight hover:text-slate-700">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              {post.excerpt}
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Topic: Supplier Reconciliation
              </span>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-xs sm:text-sm font-semibold text-slate-900 hover:text-slate-700 underline"
              >
                Read Article &rarr;
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
