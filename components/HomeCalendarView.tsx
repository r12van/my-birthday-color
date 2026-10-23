'use client';

import { useState } from 'react';
import Link from 'next/link';
import chroma from 'chroma-js';
import { birthdayColors, Horoscope } from '@/lib/colorData';

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
];

const zodiacs: Horoscope[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export default function HomeCalendarView() {
  const [activeFilter, setActiveFilter] = useState<Horoscope | 'Semua'>('Semua');

  const getTextColor = (hex: string) => {
    return chroma(hex).luminance() < 0.4 ? 'text-white' : 'text-gray-900';
  };

  return (
    <div>
      {/* MENU FILTER ZODIAK STICKY RINGKAS */}
      <section
        aria-label="Filter Zodiak"
        className="sticky top-0 z-30 bg-gray-100/95 backdrop-blur-md pt-2 pb-3 mb-6 -mx-4 px-4 border-b border-gray-200/80 shadow-xs transition-all"
      >
        <div className="flex overflow-x-auto justify-start md:justify-center gap-2 px-2 scrollbar-hide snap-x items-center">
          <button
            type="button"
            onClick={() => setActiveFilter('Semua')}
            className={`snap-start cursor-pointer whitespace-nowrap px-4 py-1.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 ${
              activeFilter === 'Semua'
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
              className={`snap-start cursor-pointer whitespace-nowrap px-3.5 py-1.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 ${
                activeFilter === zodiac
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

      {/* Grid Kalender 366 Hari */}
      <nav
        className="flex gap-1.5 overflow-x-auto pb-8 snap-x"
        aria-label="Kalender Interaktif Warna Kelahiran 366 Hari"
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
          const colorsInMonth = birthdayColors.filter((c) => {
            const isMatchMonth = c.month === month;
            const isMatchZodiac = activeFilter === 'Semua' || c.horoscope === activeFilter;
            return isMatchMonth && isMatchZodiac;
          });

          if (colorsInMonth.length === 0) return null;

          return (
            <div
              key={month}
              className="flex flex-col gap-1 min-w-[140px] md:min-w-[160px] snap-start"
            >
              <div className="bg-gray-300/95 backdrop-blur-xs text-gray-800 font-bold text-center py-1 text-xs sm:text-sm uppercase z-20 shadow-xs rounded-t-md">
                {monthNames[month - 1]}
              </div>

              {colorsInMonth.map((c) => {
                const cellTextColor = getTextColor(c.hex);
                const badgeClass =
                  cellTextColor === 'text-white'
                    ? 'bg-black/30 text-white border-white/20'
                    : 'bg-white/50 text-gray-900 border-black/10';

                return (
                  <Link
                    key={`${c.month}-${c.day}`}
                    href={`/warna/${c.month}/${c.day}`}
                    className={`relative flex flex-col items-start justify-between p-2.5 h-24 w-full text-left transition-all duration-200 hover:scale-[0.98] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs rounded-sm ${cellTextColor}`}
                    style={{ backgroundColor: c.hex }}
                    aria-label={`Warna kelahiran ${c.day} ${monthNames[c.month - 1]}: ${c.colorName} (${c.hex}), zodiak ${c.horoscope}`}
                  >
                    <span
                      className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded backdrop-blur-xs border ${badgeClass}`}
                    >
                      {c.month}/{c.day}
                    </span>
                    <span className="font-semibold text-xs leading-tight line-clamp-2 mt-1">
                      {c.colorName}
                    </span>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
