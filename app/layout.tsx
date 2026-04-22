import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Birthday Color | Temukan Warna Kelahiran & Karaktermu',
  description: 'Cek 366 warna kelahiran dari 1 Januari hingga 31 Desember. Temukan arti warnamu, horoskop, dan inspirasi kombinasi palet warna estetik secara instan.',
  keywords: ['Birthday Color', 'Warna Lahir', 'Palet Warna Zodiak', 'Warna 366 Hari', 'Inspirasi Warna', 'Hex Color Zodiak'],
  authors: [{ name: 'Pembuat Birthday Color' }],
  openGraph: {
    title: 'Birthday Color Generator - Temukan Warnamu!',
    description: 'Pilih tanggal lahirmu dan temukan warna spesifik yang mewakili karaktermu beserta palet kombinasi desainnya.',
    url: 'https://domain-anda.com', // Nanti ganti dengan domain asli Anda
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
      <body>{children}</body>
    </html>
  );
}