import { birthdayColors } from '@/lib/colorData';
import { Metadata } from 'next';
import ColorDetailClient from '@/components/ColorDetailClient';

const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://siom.ai.id';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ month: string, day: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const monthInt = parseInt(resolvedParams.month, 10);
  const dayInt = parseInt(resolvedParams.day, 10);
  const monthName = monthNames[monthInt - 1] || '';
  const data = birthdayColors.find(c => c.month === monthInt && c.day === dayInt);
  
  if (!data) {
    return {
      title: 'Warna Kelahiran Tidak Ditemukan',
      description: 'Data tanggal lahir tidak ditemukan di kalender 366 hari.',
      robots: { index: false, follow: false },
    };
  }

  const title = `${data.colorName} (${data.hex}) - Warna Lahir ${dayInt} ${monthName}`;
  const description = `${data.meaning} Karakteristik warna kelahiran ${dayInt} ${monthName}, horoskop ${data.horoscope}, kode HEX ${data.hex}, dan inspirasi kombinasi palet estetik.`;
  const canonicalPath = `/warna/${monthInt}/${dayInt}`;

  return {
    title,
    description,
    keywords: [
      data.colorName,
      data.hex,
      `Warna Lahir ${dayInt} ${monthName}`,
      `Birthday Color ${dayInt} ${monthName}`,
      `Zodiak ${data.horoscope}`,
      `Warna ${data.horoscope}`,
      'Palet Warna Harmonis',
      'Arti Warna Kelahiran',
      'Hex Color',
    ],
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${data.colorName} - Warna Lahir ${dayInt} ${monthName}`,
      description: `${data.meaning} Temukan palet kombinasi dan filosofi karakter untuk kelahiran ${dayInt} ${monthName}.`,
      url: `${siteUrl}${canonicalPath}`,
      siteName: 'Birthday Color Indonesia',
      locale: 'id_ID',
      type: 'article',
      images: [
        {
          url: '/logo.png',
          width: 1024,
          height: 1024,
          alt: `${data.colorName} - Warna Lahir ${dayInt} ${monthName}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data.colorName} (${data.hex}) - Warna Lahir ${dayInt} ${monthName}`,
      description: data.meaning,
      images: ['/logo.png'],
    },
  };
}

export default async function DetailPage({ 
  params 
}: { 
  params: Promise<{ month: string, day: string }> 
}) {
  const resolvedParams = await params;
  const monthInt = parseInt(resolvedParams.month, 10);
  const dayInt = parseInt(resolvedParams.day, 10);
  const monthName = monthNames[monthInt - 1] || '';
  const data = birthdayColors.find(c => c.month === monthInt && c.day === dayInt);

  if (!data) return <div className="p-10 text-center">Data tidak ditemukan.</div>;

  const canonicalUrl = `${siteUrl}/warna/${monthInt}/${dayInt}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `Warna Lahir ${dayInt} ${monthName}`,
        item: canonicalUrl,
      },
    ],
  };

  const colorEntitySchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${data.colorName} (${data.hex})`,
    description: data.meaning,
    inLanguage: 'id',
    url: canonicalUrl,
    about: {
      '@type': 'Thing',
      name: `Karakter Kelahiran ${dayInt} ${monthName}`,
      description: `Zodiak ${data.horoscope}, kode warna ${data.hex}, nama warna ${data.colorName}.`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(colorEntitySchema) }}
      />
      <ColorDetailClient data={data} monthNames={monthNames} />
    </>
  );
}

export async function generateStaticParams() {
  return birthdayColors.map((color) => ({
    month: color.month.toString(),
    day: color.day.toString(),
  }));
}