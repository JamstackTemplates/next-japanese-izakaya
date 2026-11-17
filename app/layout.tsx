import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { ThemeProvider } from 'jamstacks';
import { ThemeScript } from 'jamstacks/server';
// Self-hosted fonts (generated from the Fontsource packages by scripts/fonts.mjs). Each Japanese font is
// split into unicode-range subsets, so pages download only the glyphs they use.
import './fonts.css';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { izakaya } from '../content/izakaya';
import { site } from '../lib/site';
import './tailwind.input.css';

// Absolute URLs only when the deployed URL is known at build time. Never fall back to localhost.
const socialImage = site.url ? [{ url: `${site.url}/og.png`, width: 1200, height: 630, alt: `${izakaya.name}: ${izakaya.tagline}` }] : undefined;
const description = site.description || izakaya.introduction;
const title = `${izakaya.name} · ${izakaya.kindJa} ${izakaya.nameJa}`;

export const metadata: Metadata = {
  title: { default: title, template: `%s · ${izakaya.name}` },
  description,
  applicationName: site.name,
  ...(site.url ? { metadataBase: new URL(`${site.url}/`) } : {}),
  openGraph: {
    type: 'website',
    siteName: site.name,
    title,
    description,
    ...(site.url ? { url: `${site.url}/` } : {}),
    images: socialImage,
  },
  twitter: { card: socialImage ? 'summary_large_image' : 'summary' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#22385c' },
    { media: '(prefers-color-scheme: dark)', color: '#121e33' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><ThemeScript /></head>
      <body>
        <ThemeProvider>
          <a className="absolute -top-16 left-4 z-[200] rounded-ui bg-paper px-4 py-2.5 font-bold text-ink no-underline focus:top-4" href="#main">Skip to content</a>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="wall wall-glow">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
