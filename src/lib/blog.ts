export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  datePublished: string;
  dateModified: string;
  formattedDate: string;
  readTime: string;
  author: {
    name: string;
    type: 'Organization' | 'Person';
  };
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'supplier-short-shipment',
    title: 'Supplier Short Shipment: How to Find, Calculate, and Document Shortages',
    description:
      'Learn how to identify, calculate, and document supplier short shipments by comparing ordered and received quantities.',
    excerpt:
      'A practical guide for purchasing, receiving, and warehouse teams to spot short shipments, calculate discrepancy values, and document shortages for vendor credit claims.',
    datePublished: '2026-09-09',
    dateModified: '2026-09-09',
    formattedDate: 'September 9, 2026',
    readTime: '6 min read',
    author: {
      name: 'ShipRecon Editorial Team',
      type: 'Organization',
    },
  },
];

export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
