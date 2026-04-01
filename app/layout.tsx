import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ETHSKILLS — Ethereum Knowledge for AI Agents',
  description: 'The missing knowledge between AI agents and production Ethereum.',
  openGraph: {
    title: 'ETHSKILLS',
    description: 'The missing knowledge between AI agents and production Ethereum.',
    url: 'https://ethskills.com',
    type: 'website',
    images: ['https://ethskills.com/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ETHSKILLS',
    description: 'The missing knowledge between AI agents and production Ethereum.',
    images: ['https://ethskills.com/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
