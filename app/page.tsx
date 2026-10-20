'use client';

import { useState } from 'react';
import Link from 'next/link';
import chroma from 'chroma-js';
import { birthdayColors, Horoscope } from '@/lib/colorData';

export default function Home() {
  // State untuk filter zodiak. Default-nya 'Semua'
  const [activeFilter, setActiveFilter] = useState<Horoscope | 'Semua'>('Semua');

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
  const zodiacs: Horoscope[] = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

  const getTextColor = (hex: string) => {
    return chroma(hex).luminance() < 0.4 ? 'text-white' : 'text-gray-900';
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 font-sans">
      <header className="mb-8 mt-4 text-center sticky top-0 bg-gray-100 z-30 pb-4">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-widest uppercase">Birthday Color</h1>
        <p className="text-gray-500 mt-2 mb-6">Pilih tanggal lahirmu untuk melihat detail warnanya</p>

        {/* MENU FILTER ZODIAK - Ditambahkan z-index dan cursor-pointer */}
        <div className="flex overflow-x-auto justify-start md:justify-center gap-2 pb-4 px-4 scrollbar-hide snap-x relative z-40">
          <button
            type="button"
            onClick={() => setActiveFilter('Semua')}
            className={`snap-start cursor-pointer whitespace-nowrap px-4 py-2 rounded-full font-bold text-sm transition-all duration-200 ${activeFilter === 'Semua' ? 'bg-gray-800 text-white shadow-lg scale-105' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
          >
            Semua
          </button>
          {zodiacs.map((zodiac) => (
            <button
              key={zodiac}
              type="button"
              onClick={() => {
                console.log("Filtering to:", zodiac); // Untuk cek di console HP
                setActiveFilter(zodiac);
              }}
              className={`snap-start cursor-pointer whitespace-nowrap px-4 py-2 rounded-full font-bold text-sm transition-all duration-200 ${activeFilter === zodiac ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
            >
              {zodiac}
            </button>
          ))}
        </div>
      </header>

      {/* Grid Kalender */}
      <nav className="flex gap-1 overflow-x-auto pb-8 snap-x" aria-label="Kalender Warna Kelahiran">
        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => {
          // Filter data berdasarkan bulan DAN zodiak yang aktif
          const colorsInMonth = birthdayColors.filter(c => {
            const isMatchMonth = c.month === month;
            const isMatchZodiac = activeFilter === 'Semua' || c.horoscope === activeFilter;
            return isMatchMonth && isMatchZodiac;
          });

          // Sembunyikan kolom bulan jika tidak ada tanggal yang cocok dengan filter zodiak
          if (colorsInMonth.length === 0) return null;

          return (
            <div key={month} className="flex flex-col gap-1 min-w-[140px] md:min-w-[160px] snap-start">
              <div className="bg-gray-300 text-gray-800 font-bold text-center py-2 text-sm uppercase sticky top-0 z-20 shadow-sm">
                {monthNames[month - 1]}
              </div>

              {colorsInMonth.map(c => {
                const cellTextColor = getTextColor(c.hex);
                return (
                  <Link
                    key={`${c.month}-${c.day}`}
                    href={`/warna/${c.month}/${c.day}`}
                    className={`relative flex flex-col items-start justify-between p-2 h-24 w-full text-left transition-all duration-300 hover:scale-[0.98] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm rounded-sm ${cellTextColor}`}
                    style={{ backgroundColor: c.hex }}
                    aria-label={`Warna untuk ${c.day} ${monthNames[c.month - 1]}: ${c.colorName}`}
                  >
                    <span className="font-bold text-sm bg-black/10 px-1 rounded backdrop-blur-sm">
                      {c.month}/{c.day}
                    </span>
                    <span className="font-medium text-xs leading-tight line-clamp-2 mt-1">
                      {c.colorName}
                    </span>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>
    </main>
  );
}