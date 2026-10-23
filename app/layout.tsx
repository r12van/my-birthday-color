import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://siom.ai.id';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Birthday Color Indonesia | Temukan Karakter & Makna Warna Kelahiran',
    template: '%s | Birthday Color Indonesia',
  },
  description:
    'Cek 366 warna kelahiran dari 1 Januari hingga 31 Desember. Temukan arti warnamu, horoskop zodiak, dimensi teori warna, dan inspirasi kombinasi palet estetik secara instan.',
  keywords: [
    'Birthday Color',
    'Warna Lahir',
    'Palet Warna Zodiak',
    'Warna 366 Hari',
    'Inspirasi Warna',
    'Hex Color Zodiak',
    'Arti Warna Kelahiran',
    'Colorstrology Indonesia',
    'Kombinasi Warna Estetik',
    'Warna Keberuntungan Lahir',
  ],
  authors: [{ name: 'Birthday Color Indonesia', url: siteUrl }],
  creator: 'Birthday Color Indonesia',
  publisher: 'Birthday Color Indonesia',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Birthday Color Indonesia | Temukan Karakter & Makna Warna Kelahiran',
    description:
      'Pilih tanggal lahirmu dan temukan warna spesifik yang mewakili karaktermu beserta filosofi dan palet kombinasi desainnya.',
    url: siteUrl,
    siteName: 'Birthday Color Indonesia',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1024,
        height: 1024,
        alt: 'Birthday Color Indonesia Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Birthday Color Indonesia | Temukan Warna Kelahiranmu',
    description:
      'Cek warna kelahiranmu dan temukan inspirasi palet yang harmonis untuk desain dan karaktermu!',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Birthday Color Indonesia',
    alternateName: 'Birthday Color',
    url: siteUrl,
    description:
      'Eksplorasi 366 warna kelahiran dari 1 Januari sampai 31 Desember lengkap dengan kode HEX, palet harmonis, dan filosofi kepribadian.',
    inLanguage: 'id-ID',
    publisher: {
      '@type': 'Organization',
      name: 'Birthday Color Indonesia',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
  };

  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}