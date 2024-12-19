import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Ganjil Genap - Cek Lokasimu',
  description:
    'Cek apakah lokasimu masuk zona ganjil genap di Jakarta. Informasi terkini tentang pembatasan kendaraan bermotor di Jakarta berdasarkan plat nomor ganjil atau genap.',
  keywords: [
    'ganjil genap jakarta',
    'pembatasan kendaraan jakarta',
    'cek zona ganjil genap',
    'cek ganjil genap',
    'peraturan ganjil genap',
    'rute ganjil genap',
    'gage',
    'gage jakarta',
  ],
  authors: [{ name: 'Fahrul Alwan' }],
  creator: 'Fahrul Alwan',
  publisher: 'Fahrul Alwan',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ganjil-genap.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Ganjil Genap - Cek Lokasimu',
    description:
      'Cek apakah lokasimu masuk zona ganjil genap di Jakarta. Informasi terkini tentang pembatasan kendaraan bermotor.',
    url: 'https://ganjil-genap.vercel.app',
    siteName: 'Ganjil Genap Jakarta',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ganjil Genap Jakarta Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ganjil Genap - Cek Lokasimu',
    description: 'Cek apakah lokasimu masuk zona ganjil genap di Jakarta',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // You'll need to replace this with your actual verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id-ID">
      <body className={inter.className}>
        <main className="min-h-screen bg-background text-foreground">
          {children}
        </main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
