import { birthdayColors } from '@/lib/colorData';
import chroma from 'chroma-js';
import { Metadata } from 'next';
import Link from 'next/link';

// 1. Fungsi SEO (Tambahkan Promise dan await pada params)
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ month: string, day: string }> 
}): Promise<Metadata> {
  // Tunggu params terbuka
  const resolvedParams = await params;
  
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const data = birthdayColors.find(c => c.month === parseInt(resolvedParams.month) && c.day === parseInt(resolvedParams.day));
  
  const title = `Warna Lahir ${resolvedParams.day} ${monthNames[parseInt(resolvedParams.month) - 1]}`;
  const description = data 
    ? `Temukan makna warna ${data.colorName} untuk kelahiran ${resolvedParams.day} ${monthNames[parseInt(resolvedParams.month) - 1]}. Lengkap dengan zodiak dan palet warna.`
    : `Cek warna keberuntungan berdasarkan tanggal lahirmu.`;

  return { title, description };
}

// 2. Tampilan Halaman Detail (Tambahkan async dan await pada params)
export default async function DetailPage({ 
  params 
}: { 
  params: Promise<{ month: string, day: string }> 
}) {
  // Tunggu params terbuka
  const resolvedParams = await params;

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const data = birthdayColors.find(c => c.month === parseInt(resolvedParams.month) && c.day === parseInt(resolvedParams.day));

  if (!data) return <div className="p-10 text-center">Data tidak ditemukan.</div>;

  const textColor = chroma(data.hex).luminance() < 0.4 ? 'text-white' : 'text-gray-900';
  const rgb = chroma(data.hex).rgb();
  const baseColor = chroma(data.hex);
  const [h, s, l] = baseColor.hsl(); // Ambil nilai Hue, Saturation, dan Lightness

  let palettes;

  // Cek jika warna tidak memiliki Hue (Hitam/Putih) atau Saturation sangat rendah (Abu-abu)
  if (isNaN(h) || s < 0.05) {
    if (l < 0.2) {
      // KASUS HITAM / GELAP PEKAT (Tema Mewah & Elegan)
      palettes = {
        // Harmonis: Disandingkan dengan Biru Navy Gelap dan Merah Burgundy Gelap
        analogous: ['#0A192F', data.hex, '#30011E'],
        // Kontras: Disandingkan dengan Emas (Gold) klasik
        complementary: '#D4AF37',
        // Dinamis: Hitam bersama Hijau Zamrud (Emerald) dan Merah Delima (Ruby)
        triadic: [data.hex, '#50C878', '#E0115F']
      };
    } else if (l > 0.8) {
      // KASUS PUTIH / TERANG BERSIH (Tema Segar & Modern)
      palettes = {
        // Harmonis: Disandingkan dengan Krem (Ivory) dan Merah Muda Pucat (Blush)
        analogous: ['#FFFFF0', data.hex, '#FFE4E1'],
        // Kontras: Disandingkan dengan Biru Royal yang tegas
        complementary: '#4169E1',
        // Dinamis: Putih bersama Teal dan Oranye Koral
        triadic: [data.hex, '#008080', '#FF7F50']
      };
    } else {
      // KASUS ABU-ABU NETRAL (Tema Keseimbangan Hangat/Dingin)
      palettes = {
        // Harmonis: Disandingkan dengan Biru Batu Tulis (Slate) dan Hijau Sage
        analogous: ['#708090', data.hex, '#8F9779'],
        // Kontras: Disandingkan dengan Oranye Karat (Burnt Orange) untuk memberi kehangatan
        complementary: '#CC5500',
        // Dinamis: Abu-abu bersama Kuning Mustard dan Merah Bata Lembut (Dusty Rose)
        triadic: [data.hex, '#FFDB58', '#DCAE96']
      };
    }
  } else {
    // KASUS WARNA NORMAL BERPIGMEN (Dihitung matematis secara dinamis)
    palettes = {
      analogous: [baseColor.set('hsl.h', '-30').hex(), data.hex, baseColor.set('hsl.h', '+30').hex()],
      complementary: baseColor.set('hsl.h', '+180').hex(),
      triadic: [data.hex, baseColor.set('hsl.h', '+120').hex(), baseColor.set('hsl.h', '+240').hex()]
    };
  }
  return (
    <article className={`min-h-screen p-6 md:p-12 transition-colors duration-500 ${textColor}`} style={{ backgroundColor: data.hex }}>
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="mb-8 inline-block font-bold opacity-70 hover:opacity-100">← Kembali ke Kalender</Link>
        
        <header>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight" style={{ color: palettes.complementary }}>{data.day} {monthNames[data.month - 1]}</h1>
          <h2 className="text-3xl md:text-5xl font-bold mb-2">{data.colorName}</h2>
          <p className="text-2xl md:text-3xl font-mono uppercase opacity-90 mb-8">{data.hex}</p>
          <div className="font-mono text-lg opacity-80 mb-10">
            <p>R:{rgb[0]} G:{rgb[1]} B:{rgb[2]}</p>
            <p>Zodiak: {data.horoscope}</p>
          </div>
          <div className={`p-6 border-l-4` }
            style={{ borderColor: palettes.triadic[1] }}>
            <p className="text-lg italic" style={{color: palettes.triadic[2]}}>"{data.meaning}"</p>
          </div>
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
                  <div className="flex-1" style={{ backgroundColor: data.hex }} title={data.hex}></div>
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

// 3. Fungsi Static Export
export async function generateStaticParams() {
  return birthdayColors.map((color) => ({
    month: color.month.toString(),
    day: color.day.toString(),
  }));
}