import test from 'node:test';
import assert from 'node:assert';
import robots from '../../app/robots';
import sitemap from '../../app/sitemap';

test('robots.txt returns correct sitemap URL and rules', () => {
  const robotsData = robots();
  assert.strictEqual(robotsData.sitemap, 'https://ship-recon.vercel.app/sitemap.xml');
  assert.deepStrictEqual(robotsData.rules, {
    userAgent: '*',
    allow: '/',
    disallow: '',
  });
});

test('sitemap.xml returns URLs pointing to https://ship-recon.vercel.app', () => {
  const sitemapData = sitemap();
  assert.ok(sitemapData.length > 0, 'Sitemap should contain entries');

  const expectedUrls = [
    'https://ship-recon.vercel.app',
    'https://ship-recon.vercel.app/reconcile',
    'https://ship-recon.vercel.app/blog',
    'https://ship-recon.vercel.app/blog/supplier-short-shipment',
    'https://ship-recon.vercel.app/about',
    'https://ship-recon.vercel.app/privacy',
  ];

  for (const entry of sitemapData) {
    assert.ok(
      entry.url.startsWith('https://ship-recon.vercel.app'),
      `URL ${entry.url} does not start with https://ship-recon.vercel.app`
    );
  }

  assert.deepStrictEqual(sitemapData.map((e) => e.url), expectedUrls);
});
