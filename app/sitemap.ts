import type { MetadataRoute } from 'next';
import { birthdayColors } from '@/lib/colorData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://siom.ai.id';
  const currentDate = new Date();

  // Root Homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // 366 Birthday Color detail pages
  const colorRoutes: MetadataRoute.Sitemap = birthdayColors.map((item) => ({
    url: `${baseUrl}/warna/${item.month}/${item.day}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...routes, ...colorRoutes];
}
