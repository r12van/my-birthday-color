import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import QuickDatePicker from '@/components/QuickDatePicker';
import HomeCalendarView from '@/components/HomeCalendarView';
import { birthdayColors } from '@/lib/colorData';

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
];

function getLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const [lr, lg, lb] = [r, g, b].map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

export const metadata: Metadata = {
  title: 'Birthday Color Indonesia | Temukan Karakter & Makna Warna Kelahiran 366 Hari',
  description:
    'Temukan warna dan filosofi karakter kelahiranmu dari 1 Januari hingga 31 Desember. Lengkap dengan palet warna harmonis, kode HEX, dan zodiak.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Birthday Color Indonesia - Cek Warna Kelahiranmu!',
    description:
      'Pilih tanggal lahirmu dan temukan warna spesifik yang mewakili karaktermu beserta filosofi dan palet kombinasi desainnya.',
    url: 'https://siom.ai.id',
    type: 'website',
  },
};

export default function Home() {
  const faqList = [
    {
      q: 'Apa itu Birthday Color dan bagaimana filosofinya?',
      a: 'Birthday Color adalah perpaduan antara astrologi, numerologi, dan psikologi warna (Colorstrology) yang mengaitkan setiap hari sepanjang tahun (366 hari, termasuk 29 Februari) dengan rona warna khusus. Warna ini mencerminkan karakteristik kepribadian, kekuatan emosional, serta energi positif bagi orang yang lahir pada tanggal tersebut.',
    },
    {
      q: 'Apa perbedaan antara Birthday Color dengan Batu Kelahiran (Birthstone)?',
      a: 'Birthstone (batu kelahiran) umumnya dihitung per bulan (hanya ada 12 batu kelahiran dalam setahun). Sebaliknya, Birthday Color bersifat jauh lebih spesifik dan personal karena memiliki 366 rona warna unik untuk setiap tanggal dari 1 Januari hingga 31 Desember.',
    },
    {
      q: 'Apakah tanggal 29 Februari (tahun kabisat) memiliki warna tersendiri?',
      a: 'Ya! Kalender Birthday Color kami mencakup tanggal 29 Februari secara lengkap dengan nama warna, kode HEX, zodiak Pisces, dan filosofi kepribadian khusus untuk mereka yang lahir di tahun kabisat.',
    },
    {
      q: 'Bagaimana cara menggunakan kode HEX warna kelahiran saya?',
      a: 'Setiap warna kelahiran dilengkapi dengan kode HEX (misalnya #E63946) dan nilai RGB. Anda cukup mengklik tombol salin pada kartu detail untuk menggunakannya di Canva, Figma, Photoshop, website personal, maupun palet branding media sosial.',
    },
    {
      q: 'Bisakah saya membagikan kartu warna kelahiran ke Instagram Story?',
      a: 'Tentu saja! Pada halaman detail setiap tanggal, tersedia tab ekspor berformat Story 9:16 (resolusi tinggi 1080x1920 px) serta kartu standar yang bisa langsung diunduh atau dibagikan melalui Web Share API ke WhatsApp, Instagram, dan Twitter.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqList.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* HERO & PENCARIAN CEPAT */}
      <header className="mb-6 mt-2 text-center animate-fade-in">
        <div className="flex justify-center mb-2">
          <Image
            src="/logo.webp"
            alt="Birthday Color Indonesia Logo"
            width={88}
            height={88}
            priority
            className="w-18 h-18 sm:w-22 sm:h-22 object-contain drop-shadow-md rounded-2xl"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 tracking-wider uppercase">
          Birthday Color Indonesia
        </h1>
        <p className="text-gray-500 mt-1.5 mb-5 text-sm md:text-base max-w-2xl mx-auto">
          Temukan warna hari kelahiran, dimensi teori warna, dan filosofi karakter tanggal lahirmu dari 366 hari dalam setahun.
        </p>

        {/* INPUT TANGGAL LAHIR CEPAT */}
        <section aria-labelledby="quick-picker-title" className="px-2 max-w-xl mx-auto">
          <h2 id="quick-picker-title" className="sr-only">
            Pencarian Cepat Warna Tanggal Lahir
          </h2>
          <QuickDatePicker />
        </section>
      </header>

      {/* KALENDER 366 HARI DENGAN FILTER ZODIAK */}
      <section aria-labelledby="calendar-heading">
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 id="calendar-heading" className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
            <span>🎨</span>
            <span>Eksplorasi Kalender 366 Hari Warna Kelahiran</span>
          </h2>
          <span className="text-xs text-gray-500 hidden sm:inline">
            366 Tanggal Lengkap
          </span>
        </div>
        <HomeCalendarView>
          <nav
            className="flex gap-1.5 overflow-x-auto pb-8 snap-x"
            aria-label="Kalender Interaktif Warna Kelahiran 366 Hari"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
              const colorsInMonth = birthdayColors.filter((c) => c.month === month);

              return (
                <div
                  key={month}
                  className="month-column flex flex-col gap-1 min-w-[140px] md:min-w-[160px] snap-start"
                  data-month={month}
                >
                  <div className="bg-gray-300/95 backdrop-blur-xs text-gray-800 font-bold text-center py-1 text-xs sm:text-sm uppercase z-20 shadow-xs rounded-t-md">
                    {monthNames[month - 1]}
                  </div>

                  {colorsInMonth.map((c) => {
                    const luminance = getLuminance(c.hex);
                    const cellTextColor = luminance < 0.4 ? 'text-white' : 'text-gray-900';
                    const badgeClass =
                      cellTextColor === 'text-white'
                        ? 'bg-black/30 text-white border-white/20'
                        : 'bg-white/50 text-gray-900 border-black/10';

                    return (
                      <Link
                        key={`${c.month}-${c.day}`}
                        href={`/warna/${c.month}/${c.day}`}
                        prefetch={false}
                        className={`date-card relative flex flex-col items-start justify-between p-2.5 h-24 w-full text-left transition-all duration-200 hover:scale-[0.98] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs rounded-sm ${cellTextColor}`}
                        style={{ backgroundColor: c.hex }}
                        data-zodiac={c.horoscope}
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
        </HomeCalendarView>
      </section>

      {/* ARTIKEL EDUKATIF & PANDUAN SEO UNTUK MENINGKATKAN KUALITAS KONTEN */}
      <article className="max-w-4xl mx-auto space-y-8 my-10 px-2">
        {/* SEKSI 1: FILOSOFI */}
        <section
          aria-labelledby="philosophy-title"
          className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xs border border-gray-200/80"
        >
          <h2
            id="philosophy-title"
            className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight"
          >
            Mengenal Birthday Color: Filosofi & Karakter Warna Kelahiran
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
            Pernahkah Anda bertanya-tanya warna apa yang secara alami selaras dengan tanggal kelahiran Anda? Konsep <strong>Birthday Color</strong> (atau <em>Colorstrology</em>) memetakan spektrum warna 366 hari kalender ke dalam frekuensi dan karakter spesifik manusia. Setiap tanggal memiliki nama warna resmi, kode HEX presisi, serta interpretasi emosional yang mencerminkan kekuatan diri.
          </p>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
            Berbeda dengan sistem astrologi tradisional yang hanya mengelompokkan 12 zodiak atau 12 batu kelahiran (birthstones), sistem warna kelahiran 366 hari memberikan identitas visual yang unik untuk setiap hari sepanjang tahun, termasuk tanggal istimewa 29 Februari.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1.5 flex items-center gap-1.5">
                <span>♈</span>
                <span>Zodiak & Horoskop</span>
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Dipadukan dengan elemen astrologi seperti Api, Tanah, Udara, dan Air untuk memperkuat aura alami Anda.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1.5 flex items-center gap-1.5">
                <span>🧠</span>
                <span>Psikologi Kepribadian</span>
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Setiap warna membawa getaran psikologis seperti ketenangan, optimisme, keberanian, hingga intuisi mendalam.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1.5 flex items-center gap-1.5">
                <span>🎯</span>
                <span>Palet Desain Harmonis</span>
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Lengkap dengan formula warna analog, kontras, dan dinamis yang siap digunakan untuk karya kreatif Anda.
              </p>
            </div>
          </div>
        </section>

        {/* SEKSI 2: PANDUAN PENGGUNAAN */}
        <section
          aria-labelledby="usage-guide-title"
          className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xs border border-gray-200/80"
        >
          <h2
            id="usage-guide-title"
            className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight"
          >
            Cara Memanfaatkan Palet Warna Kelahiran dalam Keseharian
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
            Warna kelahiran Anda bukan sekadar simbol estetika, melainkan alat praktis untuk mengekspresikan diri di berbagai bidang kreatif:
          </p>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
              <h3 className="font-bold text-blue-900 text-sm sm:text-base mb-1">
                1. Personal Branding & Media Sosial
              </h3>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                Jadikan warna kelahiran sebagai aksen utama kartu nama digital, profil LinkedIn, thumbnail konten, atau feed Instagram agar tampak konsisten dan mencerminkan autentisitas diri Anda.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
              <h3 className="font-bold text-purple-900 text-sm sm:text-base mb-1">
                2. Proyek Desain Grafis & UI/UX
              </h3>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                Gunakan kode HEX dan palet komplementer yang tersedia di halaman detail untuk menciptakan kombinasi warna yang memiliki kontras seimbang dan aksesibilitas tinggi.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
              <h3 className="font-bold text-amber-900 text-sm sm:text-base mb-1">
                3. Inspirasi Busana & Gaya Hidup (OOTD)
              </h3>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                Kenakan pakaian atau aksesori dengan sentuhan warna kelahiran pada momen penting seperti presentasi, wawancara kerja, atau perayaan ulang tahun untuk menumbuhkan rasa percaya diri.
              </p>
            </div>
          </div>
        </section>

        {/* SEKSI 3: FAQ */}
        <section
          aria-labelledby="faq-section-title"
          className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xs border border-gray-200/80"
        >
          <h2
            id="faq-section-title"
            className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 tracking-tight"
          >
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>

          <div className="divide-y divide-gray-100">
            {faqList.map((item, index) => (
              <details
                key={index}
                className="group py-4 first:pt-0 last:pb-0 cursor-pointer"
                open={index === 0}
              >
                <summary className="flex items-center justify-between text-left font-bold text-gray-900 text-sm sm:text-base list-none group-hover:text-blue-600 transition-colors">
                  <h3 className="inline font-bold pr-4">{item.q}</h3>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform duration-200 text-xs">
                    ▼
                  </span>
                </summary>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mt-2.5 pr-4">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </article>

      {/* FOOTER SEMANTIK */}
      <footer className="mt-12 text-center text-xs text-gray-400 pb-8 border-t border-gray-200 pt-6">
        <p className="font-semibold text-gray-500">
          Birthday Color Indonesia &copy; {new Date().getFullYear()} — Eksplorasi 366 Warna Kelahiran & Zodiak
        </p>
        <p className="mt-1">
          Didedikasikan untuk inspirasi desain, psikologi warna, dan apresiasi diri.
        </p>
      </footer>
    </main>
  );
}