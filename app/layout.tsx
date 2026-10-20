import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
});

export const metadata: Metadata = {
  title: 'Birthday Color | Temukan Warna Kelahiran & Karaktermu',
  description: 'Cek 366 warna kelahiran dari 1 Januari hingga 31 Desember. Temukan arti warnamu, horoskop, dan inspirasi kombinasi palet warna estetik secara instan.',
  keywords: ['Birthday Color', 'Warna Lahir', 'Palet Warna Zodiak', 'Warna 366 Hari', 'Inspirasi Warna', 'Hex Color Zodiak'],
  authors: [{ name: 'Pembuat Birthday Color' }],
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Birthday Color Generator - Temukan Warnamu!',
    description: 'Pilih tanggal lahirmu dan temukan warna spesifik yang mewakili karaktermu beserta palet kombinasi desainnya.',
    url: 'https://siom.ai.id', // Nanti ganti dengan domain asli Anda
    siteName: 'Birthday Color',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Birthday Color | Temukan Warna Kelahiranmu',
    description: 'Cek warna kelahiranmu dan temukan inspirasi palet yang harmonis!',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}