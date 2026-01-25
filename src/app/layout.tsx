import type { Metadata } from 'next';
import { Playfair_Display, JetBrains_Mono, Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { Providers } from '@/components/providers';
import { copy } from '@/constants/copy';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: copy.site.title,
  description: copy.site.description,
  keywords: ['Fresno', 'Carta de Adeus', 'álbum', 'música', 'rock brasileiro'],
  authors: [{ name: 'Fresno' }],
  manifest: '/site.webmanifest',
  metadataBase: new URL('https://www.cartadeadeus.cc'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome', url: '/android-chrome-192x192.png', sizes: '192x192' },
      { rel: 'android-chrome', url: '/android-chrome-512x512.png', sizes: '512x512' },
    ],
  },
  openGraph: {
    title: copy.site.title,
    description: copy.site.description,
    type: 'website',
    locale: 'pt_BR',
    url: 'https://www.cartadeadeus.cc',
    siteName: 'Carta de Adeus - Fresno',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Carta de Adeus - Fresno',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: copy.site.title,
    description: copy.site.description,
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${jetbrains.variable} ${inter.variable}`}
    >
      <body className="font-inter min-h-screen">
        <Providers>{children}</Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
