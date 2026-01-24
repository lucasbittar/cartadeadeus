import type { Metadata } from 'next';
import { Playfair_Display, JetBrains_Mono, Inter } from 'next/font/google';
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
  openGraph: {
    title: copy.site.title,
    description: copy.site.description,
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: copy.site.title,
    description: copy.site.description,
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
      </body>
    </html>
  );
}
