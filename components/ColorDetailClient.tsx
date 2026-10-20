'use client';

import { useState } from 'react';
import Link from 'next/link';
import chroma from 'chroma-js';
import * as htmlToImage from 'html-to-image';
import { BirthdayData, Horoscope, getColorTheory } from '@/lib/colorData';
import QuickDatePicker from '@/components/QuickDatePicker';

interface ColorDetailClientProps {
  data: BirthdayData;
  monthNames: string[];
}

const ZODIAC_SYMBOLS: Record<Horoscope, string> = {
  Aries: '♈ Aries',
  Taurus: '♉ Taurus',
  Gemini: '♊ Gemini',
  Cancer: '♋ Cancer',
  Leo: '♌ Leo',
  Virgo: '♍ Virgo',
  Libra: '♎ Libra',
  Scorpio: '♏ Scorpio',
  Sagittarius: '♐ Sagittarius',
  Capricorn: '♑ Capricorn',
  Aquarius: '♒ Aquarius',
  Pisces: '♓ Pisces',
};

export default function ColorDetailClient({ data, monthNames }: ColorDetailClientProps) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'card' | 'story'>('card');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setToastMsg(`${label} disalin!`);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const handleDownload = async (targetFormat: 'card' | 'story' = activeTab) => {
    const elementId = targetFormat === 'story' ? 'export-card-story' : 'export-card-standard';
    const element = document.getElementById(elementId);
    if (!element) return;

    setIsExporting(true);
    setToastMsg('Mempersiapkan gambar ' + (targetFormat === 'story' ? 'Story 9:16...' : 'Kartu...'));

    try {
      // Untuk story 9:16 (360x640), gunakan pixelRatio 3 agar menghasilkan resolusi pas 1080x1920 (Full HD Instagram Story)
      const pixelRatio = targetFormat === 'story' ? 3 : 2;
      const blob = await htmlToImage.toBlob(element, {
        quality: 1.0,
        pixelRatio,
        backgroundColor: data.hex,
      });

      if (!blob) throw new Error('Gagal membuat gambar');

      const prefix = targetFormat === 'story' ? 'BirthdayColor-Story' : 'BirthdayColor-Card';
      const fileName = `${prefix}-${data.day}-${monthNames[data.month - 1]}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // Gunakan Menu Share HP jika tersedia
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Birthday Color - ${data.colorName}`,
          text: `Ini warna keberuntungan tanggal lahirku (${data.day} ${monthNames[data.month - 1]}): ${data.colorName} ${data.hex}! Cek milikmu juga.`,
        });
        setToastMsg('Siap dibagikan!');
      } else {
        // Fallback unduh langsung di browser
        const dataUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        link.click();
        URL.revokeObjectURL(dataUrl);
        setToastMsg(`Gambar ${targetFormat === 'story' ? 'Story (1080x1920)' : 'Kartu'} berhasil diunduh!`);
      }
    } catch (error) {
      console.error('Error saat membuat gambar:', error);
      setToastMsg('Gagal memproses gambar. Coba lagi.');
    } finally {
      setIsExporting(false);
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const luminance = chroma(data.hex).luminance();
  const textColor = luminance < 0.4 ? 'text-white' : 'text-gray-900';
  const rgb = chroma(data.hex).rgb();

  const baseColor = chroma(data.hex);
  const [h, s, l] = baseColor.hsl();
  let palettes: {
    analogous: string[];
    complementary: string;
    triadic: string[];
  };

  if (isNaN(h) || s < 0.05) {
    if (l < 0.2) {
      palettes = {
        analogous: ['#0A192F', data.hex, '#30011E'],
        complementary: '#D4AF37',
        triadic: [data.hex, '#50C878', '#E0115F'],
      };
    } else if (l > 0.8) {
      palettes = {
        analogous: ['#FFFFF0', data.hex, '#FFE4E1'],
        complementary: '#4169E1',
        triadic: [data.hex, '#008080', '#FF7F50'],
      };
    } else {
      palettes = {
        analogous: ['#708090', data.hex, '#8F9779'],
        complementary: '#CC5500',
        triadic: [data.hex, '#FFDB58', '#DCAE96'],
      };
    }
  } else {
    palettes = {
      analogous: [
        baseColor.set('hsl.h', '-30').hex(),
        data.hex,
        baseColor.set('hsl.h', '+30').hex(),
      ],
      complementary: baseColor.set('hsl.h', '+180').hex(),
      triadic: [
        data.hex,
        baseColor.set('hsl.h', '+120').hex(),
        baseColor.set('hsl.h', '+240').hex(),
      ],
    };
  }

  const zodiacBadge = ZODIAC_SYMBOLS[data.horoscope] || data.horoscope;
  const theory = getColorTheory(data.hex);
  const cardBgClass = textColor === 'text-white' ? 'bg-black/15' : 'bg-white/20';

  return (
    <article
      className={`min-h-screen p-4 sm:p-6 md:p-12 transition-colors duration-700 ${textColor}`}
      style={{ backgroundColor: data.hex }}
    >
      {/* Toast Notifikasi */}
      {toastMsg && (
        <div className="fixed top-6 sm:top-8 left-1/2 -translate-x-1/2 max-w-[90vw] bg-black/90 text-white font-medium px-5 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-2xl z-50 animate-fade-in border border-white/20 flex items-center gap-2 text-xs sm:text-sm text-center">
          <span>✨</span>
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* NAV & AKSI ATAS */}
        <header className="flex flex-wrap justify-between items-center gap-3 mb-6 animate-fade-in">
          <Link
            href="/"
            className="font-bold inline-flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-all hover:-translate-x-1"
          >
            <span aria-hidden="true">←</span>
            <span>Kembali ke Kalender</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={`px-3 py-1.5 rounded-xl text-xs md:text-sm font-semibold border transition-all active:scale-95 cursor-pointer ${
                textColor === 'text-white'
                  ? 'border-white/40 bg-white/10 hover:bg-white/20'
                  : 'border-gray-900/30 bg-black/5 hover:bg-black/10'
              }`}
            >
              🗓️ {showDatePicker ? 'Tutup Pilihan' : 'Cek Tanggal Lain'}
            </button>

            <button
              type="button"
              onClick={() => handleDownload(activeTab)}
              disabled={isExporting}
              className={`px-4 py-2 font-bold rounded-xl border-2 transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 cursor-pointer ${
                textColor === 'text-white'
                  ? 'border-white bg-white/20 hover:bg-white/35'
                  : 'border-gray-900 bg-black/10 hover:bg-black/20'
              }`}
            >
              <span>{activeTab === 'story' ? '📱' : '📸'}</span>
              <span>{isExporting ? 'Memproses...' : activeTab === 'story' ? 'Unduh Story (9:16)' : 'Unduh & Share IG'}</span>
            </button>
          </div>
        </header>

        {/* QUICK DATE PICKER COLLAPSIBLE */}
        {showDatePicker && (
          <div className="mb-6 animate-slide-down">
            <QuickDatePicker
              initialMonth={data.month}
              initialDay={data.day}
              className="border-2 shadow-2xl"
            />
          </div>
        )}

        {/* FORMAT SELECTOR (FASE 2) */}
        <nav
          className="flex justify-center mb-6 animate-fade-in"
          aria-label="Pilihan format tampilan dan ekspor kartu"
        >
          <div className="inline-flex p-1 rounded-2xl bg-black/20 backdrop-blur-md border border-white/20 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab('card')}
              className={`cursor-pointer px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'card'
                  ? 'bg-white text-gray-900 shadow-md scale-100'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <span>🖼️</span>
              <span>Kartu Standar</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('story')}
              className={`cursor-pointer px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'story'
                  ? 'bg-white text-gray-900 shadow-md scale-100'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <span>📱</span>
              <span>Story IG (9:16)</span>
            </button>
          </div>
        </nav>

        {/* TAB 1: KARTU STANDAR (DETAIL) */}
        {activeTab === 'card' && (
          <div
            id="export-card-standard"
            className={`p-6 sm:p-10 rounded-3xl backdrop-blur-md shadow-2xl animate-fade-up border border-white/10 ${cardBgClass}`}
          >
            <header className="animate-fade-up">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/20 text-white border border-white/20 shadow-xs">
                  {zodiacBadge}
                </span>
                <span
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/20 text-white border border-white/20 shadow-xs"
                  title={`Suhu Warna: ${theory.temperatureLabel}`}
                >
                  <span>{theory.temperatureIcon}</span>
                  <span>{theory.temperatureLabel}</span>
                </span>
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/20 text-white border border-white/20 shadow-xs"
                  title={`Bentuk Nilai Warna: ${theory.toneTypeLabel}`}
                >
                  {theory.toneTypeLabel.split(' ')[0]}
                </span>
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/20 text-white border border-white/20 shadow-xs"
                  title={`Roda Warna: ${theory.familyLabel} (${theory.wheelCategoryLabel})`}
                >
                  {theory.familyLabel}
                </span>
                <span className="text-xs font-mono opacity-80 ml-auto hidden sm:inline">
                  RGB({rgb.join(', ')})
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold mb-2 tracking-tight">
                {data.day} {monthNames[data.month - 1]}
              </h1>

              <h2 className="text-3xl md:text-5xl font-bold mb-4">{data.colorName}</h2>

              <div className="flex items-center gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => handleCopy(data.hex, 'Kode HEX')}
                  className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/15 hover:bg-black/25 text-xl md:text-2xl font-mono uppercase font-bold transition-all cursor-pointer border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/80"
                  title="Klik untuk menyalin HEX"
                  aria-label={`Salin kode warna HEX ${data.hex}`}
                >
                  <span>{data.hex}</span>
                  <span className="text-base group-hover:scale-110 transition-transform">📋</span>
                </button>
                <span className="text-xs opacity-75 hidden sm:inline">*Klik untuk salin</span>
              </div>

              <div
                className="p-5 md:p-6 rounded-2xl bg-black/15 backdrop-blur-sm border-l-4 my-6 shadow-sm"
                style={{ borderColor: palettes.complementary }}
              >
                <p className="text-base md:text-xl italic font-serif leading-relaxed opacity-95">
                  &ldquo;{data.meaning}&rdquo;
                </p>
              </div>
            </header>

            {/* SEKSI PALET */}
            <section className="mt-10 pt-6 border-t border-white/10 animate-fade-up animation-delay-200">
              <div className="flex justify-between items-baseline mb-4">
                <h3 className="text-xl md:text-2xl font-bold">Inspirasi Kombinasi Palet</h3>
                <span className="text-xs opacity-75">*Klik kotak warna untuk menyalin</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Harmonis */}
                <div className="bg-black/10 p-3.5 rounded-2xl border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-sm">Harmonis</h4>
                    <span className="text-[11px] opacity-70">Analogous</span>
                  </div>
                  <div className="flex h-16 rounded-xl overflow-hidden shadow-inner border border-black/10">
                    {palettes.analogous.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleCopy(c, 'Warna Harmonis')}
                        className="flex-1 hover:opacity-85 transition-opacity cursor-pointer relative group flex items-end justify-center pb-1 focus:outline-none focus:ring-2 focus:ring-white/80 focus:z-10"
                        style={{ backgroundColor: c }}
                        aria-label={`Salin kode warna harmonis ${c}`}
                        title={`Salin ${c}`}
                      >
                        <span className="text-[10px] font-mono px-1 rounded bg-black/50 text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
                          {c}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Kontras */}
                <div className="bg-black/10 p-3.5 rounded-2xl border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-sm">Kontras</h4>
                    <span className="text-[11px] opacity-70">Complementary</span>
                  </div>
                  <div className="flex h-16 rounded-xl overflow-hidden shadow-inner border border-black/10">
                    <button
                      type="button"
                      onClick={() => handleCopy(data.hex, 'Warna Utama')}
                      className="flex-1 hover:opacity-85 transition-opacity cursor-pointer relative group flex items-end justify-center pb-1 focus:outline-none focus:ring-2 focus:ring-white/80 focus:z-10"
                      style={{ backgroundColor: data.hex }}
                      aria-label={`Salin warna utama ${data.hex}`}
                      title={`Salin ${data.hex}`}
                    >
                      <span className="text-[10px] font-mono px-1 rounded bg-black/50 text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
                        {data.hex}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(palettes.complementary, 'Warna Kontras')}
                      className="flex-1 hover:opacity-85 transition-opacity cursor-pointer relative group flex items-end justify-center pb-1 focus:outline-none focus:ring-2 focus:ring-white/80 focus:z-10"
                      style={{ backgroundColor: palettes.complementary }}
                      aria-label={`Salin warna kontras ${palettes.complementary}`}
                      title={`Salin ${palettes.complementary}`}
                    >
                      <span className="text-[10px] font-mono px-1 rounded bg-black/50 text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
                        {palettes.complementary}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Dinamis */}
                <div className="bg-black/10 p-3.5 rounded-2xl border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-sm">Dinamis</h4>
                    <span className="text-[11px] opacity-70">Triadic</span>
                  </div>
                  <div className="flex h-16 rounded-xl overflow-hidden shadow-inner border border-black/10">
                    {palettes.triadic.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleCopy(c, 'Warna Dinamis')}
                        className="flex-1 hover:opacity-85 transition-opacity cursor-pointer relative group flex items-end justify-center pb-1 focus:outline-none focus:ring-2 focus:ring-white/80 focus:z-10"
                        style={{ backgroundColor: c }}
                        aria-label={`Salin warna dinamis ${c}`}
                        title={`Salin ${c}`}
                      >
                        <span className="text-[10px] font-mono px-1 rounded bg-black/50 text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
                          {c}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* SEKSI DIMENSI TEORI WARNA */}
            <section className="mt-8 pt-6 border-t border-white/10 animate-fade-up animation-delay-300">
              <div className="flex flex-wrap justify-between items-baseline gap-2 mb-4">
                <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  <span>🎨</span>
                  <span>Dimensi Teori Warna</span>
                </h3>
                <span className="text-xs opacity-75">
                  Prinsip Roda Warna, Temperatur &amp; Psikologi
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Suhu Warna */}
                <div className="bg-black/15 p-4 rounded-2xl border border-white/10 backdrop-blur-xs flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider opacity-75">Suhu Warna</span>
                      <span className="text-sm">{theory.temperatureIcon}</span>
                    </div>
                    <h4 className="text-lg font-bold mb-1.5">{theory.temperatureLabel}</h4>
                    <p className="text-xs leading-relaxed opacity-85">
                      {theory.temperatureDescription}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/10 text-[11px] font-mono opacity-70">
                    Hue: {theory.hsl.h}&deg; ({theory.temperature})
                  </div>
                </div>

                {/* Bentuk Nilai / Tone Type */}
                <div className="bg-black/15 p-4 rounded-2xl border border-white/10 backdrop-blur-xs flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider opacity-75">Variasi Nilai</span>
                      <span className="text-sm">✨</span>
                    </div>
                    <h4 className="text-lg font-bold mb-1.5">{theory.toneTypeLabel.split(' ')[0]}</h4>
                    <p className="text-xs leading-relaxed opacity-85">
                      {theory.toneTypeDescription}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/10 text-[11px] font-mono opacity-70">
                    Terang: {theory.hsl.l}% • Saturasi: {theory.hsl.s}%
                  </div>
                </div>

                {/* Roda Warna */}
                <div className="bg-black/15 p-4 rounded-2xl border border-white/10 backdrop-blur-xs flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider opacity-75">Roda Warna</span>
                      <span className="text-sm">🎡</span>
                    </div>
                    <h4 className="text-lg font-bold mb-1.5">{theory.wheelCategoryLabel}</h4>
                    <p className="text-xs leading-relaxed opacity-85">
                      Bagian dari {theory.familyLabel} dalam skema 12 lingkaran warna dasar.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/10 text-[11px] font-mono opacity-70">
                    Kategori: {theory.wheelCategory}
                  </div>
                </div>

                {/* Psikologi Teori Warna */}
                <div className="bg-black/15 p-4 rounded-2xl border border-white/10 backdrop-blur-xs flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider opacity-75">Psikologi Warna</span>
                      <span className="text-sm">🧠</span>
                    </div>
                    <h4 className="text-lg font-bold mb-1.5">Resonansi Batin</h4>
                    <p className="text-xs leading-relaxed opacity-85">
                      {theory.psychology}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/10 text-[11px] font-mono opacity-70">
                    Teori Desain Grafis
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: INSTAGRAM STORY 9:16 (FASE 2) */}
        {activeTab === 'story' && (
          <div className="flex flex-col items-center animate-scale-in">
            <p className="text-sm opacity-80 mb-3 font-medium text-center">
              Preview format Instagram & TikTok Stories (resolusi ekspor: 1080 x 1920)
            </p>

            {/* KARTU 9:16 RESPONSIVE (PROPORSIONAL 360 x 640 -> DIEKSPOR KE 1080 x 1920 DENGAN pixelRatio: 3) */}
            <div
              id="export-card-story"
              className="w-full max-w-[360px] aspect-[9/16] min-h-[580px] sm:min-h-[640px] rounded-[36px] p-6 sm:p-7 shadow-2xl relative flex flex-col justify-between overflow-hidden border border-white/20 select-none mx-auto"
              style={{
                backgroundColor: data.hex,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
              }}
            >
              {/* Decorative Subtle Background Glow Orbs */}
              <div
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-40 pointer-events-none"
                style={{ backgroundColor: palettes.complementary }}
              />
              <div
                className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
                style={{ backgroundColor: palettes.triadic[1] }}
              />

              {/* Story Top Header */}
              <div className="relative z-10 flex justify-between items-center pt-2">
                <span className="text-[11px] tracking-widest font-extrabold uppercase px-3 py-1 rounded-full bg-black/25 text-white backdrop-blur-sm border border-white/20">
                  MY BIRTHDAY COLOR
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                  {zodiacBadge}
                </span>
              </div>

              {/* Story Center Section */}
              <div className="relative z-10 text-center my-auto flex flex-col items-center">
                {/* Tanggal Lahir (Kombinasi kontras tinggi & aksen) */}
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1">
                  {data.day} {monthNames[data.month - 1]}
                </h2>

                {/* Lingkaran Swatch Utama */}
                <div
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full my-4 p-1.5 shadow-2xl border-4 flex items-center justify-center relative animate-float"
                  style={{
                    backgroundColor: data.hex,
                    borderColor: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <div className="w-full h-full rounded-full border border-black/10 flex flex-col items-center justify-center p-2 text-center">
                    <span className="text-2xl">✨</span>
                  </div>
                </div>

                {/* Nama Warna & HEX */}
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1 px-2">
                  {data.colorName}
                </h3>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-black/20 backdrop-blur-sm font-mono text-sm uppercase font-bold tracking-wider mb-2">
                  <span>{data.hex}</span>
                  <span className="text-[11px] opacity-80">RGB({rgb.join(',')})</span>
                </div>

                {/* Badge Dimensi Teori Warna untuk Story */}
                <div className="flex flex-wrap justify-center gap-1.5 mb-3 text-[10px] sm:text-[11px] font-semibold opacity-95">
                  <span className="px-2 py-0.5 rounded-full bg-black/25 backdrop-blur-sm border border-white/20 shadow-2xs">
                    {theory.temperatureIcon} {theory.temperatureLabel}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/25 backdrop-blur-sm border border-white/20 shadow-2xs">
                    {theory.toneTypeLabel.split(' ')[0]}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/25 backdrop-blur-sm border border-white/20 shadow-2xs">
                    {theory.familyLabel.replace('Keluarga ', '')}
                  </span>
                </div>

                {/* Makna / Filosofi dengan kontras tinggi terjamin */}
                <div className="p-4 rounded-2xl bg-black/20 backdrop-blur-md border border-white/20 max-w-[290px] shadow-sm">
                  <p className="text-xs sm:text-sm italic font-serif leading-snug opacity-95">
                    &ldquo;{data.meaning}&rdquo;
                  </p>
                </div>
              </div>

              {/* Story Bottom Palette & Footer */}
              <div className="relative z-10 pb-2">
                <div className="mb-2">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold opacity-80 mb-1 px-1">
                    <span>Palet Harmoni</span>
                    <span>366 Hari</span>
                  </div>
                  <div className="flex h-6 rounded-xl overflow-hidden shadow-md border border-white/20">
                    {palettes.analogous.map((c, i) => (
                      <div key={`a-${i}`} className="flex-1" style={{ backgroundColor: c }} />
                    ))}
                    <div className="flex-1" style={{ backgroundColor: palettes.complementary }} />
                    {palettes.triadic.map((c, i) => (
                      <div key={`t-${i}`} className="flex-1" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>

                <div className="text-center text-[10px] tracking-wider opacity-75 font-mono pt-1">
                  birthday-color • Cari warnamu
                </div>
              </div>
            </div>

            {/* Story Action Button */}
            <div className="mt-5">
              <button
                type="button"
                onClick={() => handleDownload('story')}
                disabled={isExporting}
                className="cursor-pointer bg-white text-gray-900 hover:bg-gray-100 active:scale-95 font-bold px-6 py-3 rounded-2xl shadow-xl transition-all flex items-center gap-2 border border-gray-200"
              >
                <span>📲</span>
                <span>{isExporting ? 'Memproses 1080x1920...' : 'Simpan & Share ke IG Story'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}