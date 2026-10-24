'use client';

import { useState } from 'react';
import type { Horoscope } from '@/lib/colorData';

const zodiacs: Horoscope[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

interface HomeCalendarViewProps {
  children: React.ReactNode;
}

export default function HomeCalendarView({ children }: HomeCalendarViewProps) {
  const [activeFilter, setActiveFilter] = useState<Horoscope | 'Semua'>('Semua');

  return (
    <div data-active-zodiac={activeFilter}>
      {/* MENU FILTER ZODIAK STICKY RINGKAS */}
      <section
        aria-label="Filter Zodiak"
        className="sticky top-0 z-30 bg-gray-100/95 backdrop-blur-md pt-2 pb-3 mb-6 -mx-4 px-4 border-b border-gray-200/80 shadow-xs transition-all"
      >
        <div className="flex overflow-x-auto justify-start md:justify-center gap-2 px-2 scrollbar-hide snap-x items-center scrollbar-y-hide">
          <button
            type="button"
            onClick={() => setActiveFilter('Semua')}
            className={`snap-start cursor-pointer whitespace-nowrap px-4 py-1.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 ${activeFilter === 'Semua'
                ? 'bg-gray-800 text-white shadow-md scale-105'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
          >
            Semua
          </button>
          {zodiacs.map((zodiac) => (
            <button
              key={zodiac}
              type="button"
              onClick={() => setActiveFilter(zodiac)}
              className={`snap-start cursor-pointer whitespace-nowrap px-3.5 py-1.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 ${activeFilter === zodiac
                  ? 'bg-blue-600 text-white shadow-md scale-105'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
            >
              {zodiac}
            </button>
          ))}
        </div>
        <div className="text-center text-[11px] text-gray-400 mt-1 md:hidden flex items-center justify-center gap-1">
          <span>←</span>
          <span>Geser horizontal untuk melihat bulan Jan - Des</span>
          <span>→</span>
        </div>
      </section>

      {/* Grid Kalender Prerendered Static Children */}
      {children}
    </div>
  );
}
