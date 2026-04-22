'use client';

import { useState, useEffect } from 'react';
import chroma from 'chroma-js';
import { birthdayColors, BirthdayData } from '@/lib/colorData';
import Link from 'next/link';

export default function Home() {
  const [selectedData, setSelectedData] = useState<BirthdayData | null>(null);

  // Efek untuk mengubah Judul Tab Browser (SEO Dinamis) saat warna diklik
  useEffect(() => {
    if (selectedData) {
      document.title = `${selectedData.day} ${monthNames[selectedData.month - 1]} - ${selectedData.colorName} | Birthday Color`;
    } else {
      document.title = 'Birthday Color | Temukan Warna Kelahiran & Karaktermu';
    }
  }, [selectedData]);

  const getTextColor = (hex: string) => {
    return chroma(hex).luminance() < 0.4 ? 'text-white' : 'text-gray-900';
  };

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

  if (selectedData) {
    const textColor = getTextColor(selectedData.hex);
    const rgb = chroma(selectedData.hex).rgb(); 
    
    const palettes = {
      analogous: [chroma(selectedData.hex).set('hsl.h', '-30').hex(), selectedData.hex, chroma(selectedData.hex).set('hsl.h', '+30').hex()],
      complementary: chroma(selectedData.hex).set('hsl.h', '+180').hex(),
      triadic: [selectedData.hex, chroma(selectedData.hex).set('hsl.h', '+120').hex(), chroma(selectedData.hex).set('hsl.h', '+240').hex()]
    };

    return (
      <article 
        className={`min-h-screen p-6 md:p-12 transition-colors duration-500 ${textColor}`}
        style={{ backgroundColor: selectedData.hex }}
      >
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setSelectedData(null)}
            className={`mb-8 flex items-center gap-2 font-bold opacity-70 hover:opacity-100 transition-opacity`}
            aria-label="Kembali ke halaman utama kalender"
          >
            ← Kembali ke Kalender
          </button>

          <header className="mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              {selectedData.day} {monthNames[selectedData.month - 1]}
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold mb-2">{selectedData.colorName}</h2>
            <p className="text-2xl md:text-3xl font-mono uppercase opacity-90 mb-8">{selectedData.hex}</p>
            
            <section className="font-mono text-lg opacity-80 mb-10 space-y-1">
              <p>R:{rgb[0]} G:{rgb[1]} B:{rgb[2]}</p>
              <p>Zodiak: {selectedData.horoscope}</p>
            </section>

            <section className={`p-6 border-l-4 ${textColor === 'text-white' ? 'border-white bg-white/10' : 'border-gray-900 bg-black/5'}`}>
              <h3 className="text-xl font-bold mb-2">Makna Warna</h3>
              <p className="text-lg">{selectedData.meaning}</p>
            </section>
          </header>

          <section className={`mt-16 p-8 rounded-3xl ${textColor === 'text-white' ? 'bg-black/20' : 'bg-white/40'} backdrop-blur-sm`}>
            <h3 className="text-2xl font-bold mb-6">Inspirasi Kombinasi Palet</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div>
                <h4 className="font-semibold mb-3">Harmonis (Analogous)</h4>
                <div className="flex h-16 rounded-xl overflow-hidden shadow-sm" aria-label="Palet warna harmonis">
                  {palettes.analogous.map((c, i) => <div key={i} className="flex-1" style={{ backgroundColor: c }} title={c}></div>)}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Kontras (Complementary)</h4>
                <div className="flex h-16 rounded-xl overflow-hidden shadow-sm" aria-label="Palet warna kontras">
                  <div className="flex-1" style={{ backgroundColor: selectedData.hex }} title={selectedData.hex}></div>
                  <div className="flex-1" style={{ backgroundColor: palettes.complementary }} title={palettes.complementary}></div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Dinamis (Triadic)</h4>
                <div className="flex h-16 rounded-xl overflow-hidden shadow-sm" aria-label="Palet warna dinamis">
                  {palettes.triadic.map((c, i) => <div key={i} className="flex-1" style={{ backgroundColor: c }} title={c}></div>)}
                </div>
              </div>

            </div>
          </section>
        </div>
      </article>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <header className="mb-8 mt-4 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-widest uppercase">Birthday Color</h1>
        <p className="text-gray-500 mt-2">Pilih tanggal lahirmu untuk melihat detail warnanya</p>
      </header>

      <nav className="flex gap-1 overflow-x-auto pb-8 snap-x" aria-label="Kalender Warna Kelahiran">
        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
          <div key={month} className="flex flex-col gap-1 min-w-[140px] md:min-w-[160px] snap-start">
            
            <div className="bg-gray-300 text-gray-800 font-bold text-center py-2 text-sm uppercase">
              {monthNames[month - 1]}
            </div>

            {birthdayColors.filter(c => c.month === month).map(c => {
              const cellTextColor = getTextColor(c.hex);
              return (
                <Link
                  key={`${c.month}-${c.day}`}
                  href={`/warna/${c.month}/${c.day}`} // Ini akan mengarahkan ke halaman detail baru
                  className={`relative flex flex-col items-start justify-between p-2 h-24 w-full text-left transition-transform hover:scale-95 shadow-sm ${cellTextColor}`}
                  style={{ backgroundColor: c.hex }}
                >
                  <span className="font-bold text-sm bg-black/10 px-1 rounded">
                    {c.month}/{c.day}
                  </span>
                  <span className="font-medium text-xs leading-tight line-clamp-2 mt-1">
                    {c.colorName}
                  </span>
                </Link>
              );
            })}
            
          </div>
        ))}
      </nav>
    </main>
  );
}