'use client';

import { useState } from 'react';
import Link from 'next/link';
import chroma from 'chroma-js';
import * as htmlToImage from 'html-to-image';
// import html2canvas from 'html2canvas';

// Mendefinisikan tipe data yang diterima dari server
export default function ColorDetailClient({ data, monthNames }: { data: any, monthNames: string[] }) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Fungsi 1: Copy to Clipboard
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setToastMsg(`${label} disalin!`);
    setTimeout(() => setToastMsg(null), 2000); // Hilang setelah 2 detik
  };

  // Fungsi 2: Download sebagai Gambar (Update menggunakan html-to-image)
  const handleDownload = async () => {
    const element = document.getElementById('export-card');
    if (!element) return;
    
    setToastMsg('Mempersiapkan gambar...');
    
    try {
      // Mengubah elemen HTML menjadi Data URL gambar PNG
      const dataUrl = await htmlToImage.toPng(element, { 
        quality: 1.0,
        pixelRatio: 4,
        backgroundColor: data.hex
      });
      
      // Membuat link buatan untuk memicu proses download otomatis
      const link = document.createElement('a');
      link.download = `BirthdayColor-${data.day}-${monthNames[data.month - 1]}.png`;
      link.href = dataUrl;
      link.click();
      
      setToastMsg('Gambar berhasil diunduh!');
    } catch (error) {
      console.error('Error saat generate gambar:', error);
      setToastMsg('Gagal mengunduh gambar. Silakan coba lagi.');
    }
    
    setTimeout(() => setToastMsg(null), 3000);
  };

  const textColor = chroma(data.hex).luminance() < 0.4 ? 'text-white' : 'text-gray-900';
  const rgb = chroma(data.hex).rgb();

  // Logika Palet Warna (Dengan perbaikan warna netral sebelumnya)
  const baseColor = chroma(data.hex);
  const [h, s, l] = baseColor.hsl();
  let palettes;

  if (isNaN(h) || s < 0.05) {
    if (l < 0.2) palettes = { analogous: ['#0A192F', data.hex, '#30011E'], complementary: '#D4AF37', triadic: [data.hex, '#50C878', '#E0115F'] };
    else if (l > 0.8) palettes = { analogous: ['#FFFFF0', data.hex, '#FFE4E1'], complementary: '#4169E1', triadic: [data.hex, '#008080', '#FF7F50'] };
    else palettes = { analogous: ['#708090', data.hex, '#8F9779'], complementary: '#CC5500', triadic: [data.hex, '#FFDB58', '#DCAE96'] };
  } else {
    palettes = {
      analogous: [baseColor.set('hsl.h', '-30').hex(), data.hex, baseColor.set('hsl.h', '+30').hex()],
      complementary: baseColor.set('hsl.h', '+180').hex(),
      triadic: [data.hex, baseColor.set('hsl.h', '+120').hex(), baseColor.set('hsl.h', '+240').hex()]
    };
  }

  return (
    <article className={`min-h-screen p-6 md:p-12 transition-colors duration-500 ${textColor}`} style={{ backgroundColor: data.hex }}>
      
      {/* Toast Notification (Popup berhasil copy/download) */}
      {toastMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-full shadow-2xl z-50 animate-bounce">
          {toastMsg}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="font-bold opacity-70 hover:opacity-100 transition-opacity">
            ← Kembali ke Kalender
          </Link>
          <button 
            onClick={handleDownload}
            className={`px-4 py-2 font-bold rounded-lg border-2 transition-all hover:scale-105 shadow-md ${textColor === 'text-white' ? 'border-white bg-white/20 hover:bg-white/40' : 'border-gray-900 bg-black/10 hover:bg-black/20'}`}
          >
            📸 Unduh & Share IG
          </button>
        </div>
        
        {/* AREA YANG AKAN DIFOTO OLEH HTML2CANVAS (id="export-card") */}
        <div id="export-card" className={`p-8 rounded-3xl ${textColor === 'text-white' ? 'bg-black/10' : 'bg-white/10'}`}>
          <header>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight" style={{ color: palettes.complementary }}>{data.day} {monthNames[data.month - 1]}</h1>
            <h2 className="text-3xl md:text-5xl font-bold mb-2">{data.colorName}</h2>
            
            {/* Tombol Klik untuk Copy HEX */}
            <button 
              onClick={() => handleCopy(data.hex, "Kode HEX")}
              className="text-2xl md:text-3xl font-mono uppercase opacity-90 mb-8 hover:underline hover:opacity-100 transition-all cursor-pointer"
              title="Klik untuk menyalin"
            >
              {data.hex} 📋
            </button>
            
            <div className="font-mono text-lg opacity-80 mb-10">
              <p>R:{rgb[0]} G:{rgb[1]} B:{rgb[2]}</p>
              <p>Zodiak: {data.horoscope}</p>
            </div>
            
            <div className={`p-6 border-l-4` }
                style={{ borderColor: palettes.triadic[2] }}>
                <p className="text-lg italic" style={{color: palettes.triadic[1]}}>"{data.meaning}"</p>
            </div>
          </header>

          <section className="mt-16">
            <h3 className="text-2xl font-bold mb-6">Inspirasi Kombinasi Palet</h3>
            <p className="opacity-70 mb-4 text-sm">*Klik warna untuk menyalin kode HEX</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Analogous */}
              <div>
                <h4 className="font-semibold mb-3">Harmonis</h4>
                <div className="flex h-16 rounded-xl overflow-hidden shadow-md cursor-pointer border border-black/10">
                  {palettes.analogous.map((c, i) => (
                    <div key={i} onClick={() => handleCopy(c, "Warna Harmonis")} className="flex-1 hover:opacity-80 transition-opacity" style={{ backgroundColor: c }} title={`Copy ${c}`}></div>
                  ))}
                </div>
              </div>

              {/* Complementary */}
              <div>
                <h4 className="font-semibold mb-3">Kontras</h4>
                <div className="flex h-16 rounded-xl overflow-hidden shadow-md cursor-pointer border border-black/10">
                  <div onClick={() => handleCopy(data.hex, "Warna Utama")} className="flex-1 hover:opacity-80 transition-opacity" style={{ backgroundColor: data.hex }} title={`Copy ${data.hex}`}></div>
                  <div onClick={() => handleCopy(palettes.complementary, "Warna Kontras")} className="flex-1 hover:opacity-80 transition-opacity" style={{ backgroundColor: palettes.complementary }} title={`Copy ${palettes.complementary}`}></div>
                </div>
              </div>

              {/* Triadic */}
              <div>
                <h4 className="font-semibold mb-3">Dinamis</h4>
                <div className="flex h-16 rounded-xl overflow-hidden shadow-md cursor-pointer border border-black/10">
                  {palettes.triadic.map((c, i) => (
                    <div key={i} onClick={() => handleCopy(c, "Warna Dinamis")} className="flex-1 hover:opacity-80 transition-opacity" style={{ backgroundColor: c }} title={`Copy ${c}`}></div>
                  ))}
                </div>
              </div>

            </div>
          </section>
        </div>

      </div>
    </article>
  );
}