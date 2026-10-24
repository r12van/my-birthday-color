# Product Requirements Document (PRD)
## Birthday Color (Warna Kelahiran)

| Metadata | Detail |
| :--- | :--- |
| **Nama Produk** | Birthday Color |
| **Versi Dokumen** | 1.0.0 |
| **Status** | Aktif / In Development |
| **Tech Stack Utama** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Chroma-js, html-to-image |
| **Target Rilis** | Web Responsive (Mobile-First & Desktop) |

---

## 1. Pendahuluan & Latar Belakang (Overview)

### 1.1 Ringkasan Produk
**Birthday Color** adalah aplikasi web interaktif yang menyajikan warna personal, makna filosofis/karakter, zodiak, serta panduan kombinasi palet warna untuk setiap 366 hari dalam setahun (1 Januari hingga 31 Desember, termasuk tahun kabisat 29 Februari). Pengguna dapat mengeksplorasi warna lahir mereka, menyalin kode warna (HEX), dan membagikan kartu visual estetik ke media sosial seperti Instagram Stories dan WhatsApp.

### 1.2 Problem Statement
- Banyak orang menyukai konten personalisasi berbasis tanggal lahir (seperti zodiak, batu kelahiran/birthstone, horoskop), namun konten berbasis **warna kelahiran** sering kali tersebar, tidak memiliki kode warna pasti (HEX/RGB), atau disajikan dalam format teks statis yang kurang estetik.
- Desainer, kreator konten, dan pengguna umum sering membutuhkan inspirasi palet warna yang harmonis dan mudah diekspor untuk kebutuhan desain grafis, ilustrasi, personal branding, atau sekadar konten media sosial.

### 1.3 Value Proposition
1. **366 Warna Unik & Terkurasi**: Setiap hari memiliki warna spesifik lengkap dengan nama, kode HEX, zodiak, dan pesan/makna karakter.
2. **Kalkulator Palet Otomatis**: Menghasilkan 3 skema harmoni warna (Harmonis/Analogous, Kontras/Complementary, Dinamis/Triadic) secara instan menggunakan teori warna algoritmik.
3. **Desain Visual Siap Dibagikan (Shareable)**: Menghasilkan kartu visual siap unduh dan mendukung langsung native Web Share API untuk kemudahan berbagi ke Instagram Stories atau chat apps.
4. **Performa Tinggi & Ramah SEO**: Dibangun dengan Static Site Generation (SSG) pada seluruh 366 rute tanggal lahir untuk waktu muat halaman mendekati instan dan optimasi mesin pencari.

---

## 2. Target Pengguna & Persona

### 2.1 Persona 1: Pengguna Kasual & Penggemar Astrologi ("The Social Sharer")
- **Profil**: Remaja dan dewasa muda (usia 16–30 tahun), pengguna aktif media sosial (Instagram, TikTok, WhatsApp, X).
- **Kebutuhan**: Ingin tahu apa warna karakter hari kelahirannya, lalu membagikannya ke media sosial untuk interaksi teman sebaya.
- **Pain Point**: Malas melakukan registrasi atau mengisi formulir panjang; butuh tampilan instan yang estetis.

### 2.2 Persona 2: Desainer Grafis & Kreator Konten ("The Visual Creator")
- **Profil**: UI/UX designer, desainer grafis, ilustrator, dan marketer kreatif.
- **Kebutuhan**: Mencari palet warna baru beserta nilai HEX/RGB yang akurat untuk proyek desain harian atau tema branding.
- **Pain Point**: Butuh salin kode warna dengan sekali klik (one-click copy) tanpa harus membuka software editor warna.

---

## 3. Fitur Produk & Kebutuhan Fungsional (Functional Requirements)

### 3.1 FR-1: Eksplorasi Kalender 366 Hari (Halaman Utama)
- **Tampilan Kalender 12 Bulan**: Grid kalender horizontal responsif dengan snap scroll, menampilkan 12 kolom bulan (Januari–Desember).
- **Blok Warna Tanggal**: Setiap kartu tanggal menampilkan nomor tanggal (format `M/D`), nama warna, serta latar belakang warna HEX yang sesuai.
- **Kontras Teks Cerdas**: Otomatis menyesuaikan warna teks (putih atau gelap) berdasarkan tingkat luminansi warna latar belakang agar selalu terbaca jelas (WCAG contrast compliant).

### 3.2 FR-2: Filter Berdasarkan Zodiak / Horoskop
- **Chip Filter Zodiak**: Menyediakan tombol filter horizontal yang dapat digeser (12 zodiak: *Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces* serta opsi *"Semua"*).
- **Penyaringan Realtime**: Menyaring daftar tanggal secara langsung di sisi klien tanpa me-reload halaman. Kolom bulan yang tidak memiliki tanggal sesuai filter akan otomatis disembunyikan.

### 3.3 FR-3: Halaman Detail Warna Kelahiran (`/warna/[month]/[day]`)
- **Akses Rute Dinamis**: Setiap tanggal memiliki URL spesifik (misal: `/warna/1/1` untuk 1 Januari, `/warna/2/29` untuk 29 Februari).
- **Informasi Lengkap**:
  - Tanggal dan nama bulan lengkap.
  - Nama warna khusus (e.g., *"Pure White"*, *"Forest Green"*).
  - Kode HEX dengan indikator copy.
  - Komposisi nilai RGB (Red, Green, Blue).
  - Horoskop / Zodiak terkait.
  - Pesan filosofis / makna warna dalam kutipan elegan.

### 3.4 FR-4: Generator Teori & Kombinasi Palet Warna (Color Theory Engine)
Berdasarkan referensi standar teori warna (Park University, IxDF, 99designs), sistem mengklasifikasikan dan menurunkan dimensi warna:
1. **Analisis Teori Warna Utama**:
   - **Temperatur Warna**: *Warm* (Hangat: energi, aksi), *Cool* (Dingin: ketenangan, intuisi), *Neutral* (Netral: keseimbangan, stabilitas).
   - **Variasi Nilai Rona (Tone Type)**: *Pure Hue* (rona murni jenuh), *Tint* (rona + putih / pastel lembut), *Tone* (rona + abu-abu / teduh bersahaja), *Shade* (rona + hitam / pekat mendalam).
   - **Posisi Roda Warna**: Primer (*Red, Yellow, Blue*), Sekunder (*Orange, Green, Purple*), Tersier (*Red-Orange, Yellow-Green, Teal, Indigo, dll.*), dan Netral Bumi.
   - **Psikologi Warna & Makna Terkurasi**: 366 filosofi tanggal lahir diperkaya dengan resonansi emosional teori warna (vitalitas, kejernihan kognitif, ketenangan reflektif, welas asih, dll.).
2. **Kombinasi Skema Harmoni Palet**:
   - **Harmonis (Analogous)**: Variasi sudut warna berdekatan ($-30^\circ$, $+30^\circ$).
   - **Kontras (Complementary)**: Warna berseberangan ($+180^\circ$).
   - **Dinamis (Triadic)**: Tiga sudut warna berjarak seimbang ($+120^\circ$, $+240^\circ$).
   - **Fallback Rule untuk Warna Netral**: Apabila warna memiliki saturasi sangat rendah ($< 0.05$) atau luminansi ekstrem (hitam pekat, putih bersih, abu-abu), sistem menggunakan kurasi palet elegan bawaan agar hasil kombinasi tetap bernilai estetis.

### 3.5 FR-5: Interaksi Salin Kode Warna (Click-to-Copy)
- Mengklik kode HEX utama atau kotak-kotak palet kombinasi akan langsung menyalin kode HEX ke papan klip (*clipboard*).
- Menampilkan feedback visual berupa **Toast Notification** mengambang yang responsif.

### 3.6 FR-6: Generator Kartu Gambar & Fitur Berbagi (Export & Social Sharing)
- **Ekspor Elemen `#export-card`**: Mengubah kontainer kartu detail menjadi file citra PNG berkualitas tinggi (`pixelRatio: 2`, `quality: 1.0`) menggunakan `html-to-image`.
- **Integrasi Web Share API**: Pada perangkat mobile yang mendukung, memicu dialog share native sistem operasi (langsung bagikan gambar ke Instagram Story, status WhatsApp, Twitter, dll.).
- **Fallback Unduh Berkas**: Jika Web Share API tidak didukung (misal browser desktop), sistem secara otomatis mengunduh berkas dengan penamaan terstruktur: `BirthdayColor-{Day}-{MonthName}.png`.

---

## 4. Kebutuhan Non-Fungsional (Non-Functional Requirements)

| Kategori | Spesifikasi & Tolok Ukur |
| :--- | :--- |
| **Performa & Rendering** | Seluruh 366 halaman rute tanggal dibuat di waktu build menggunakan `generateStaticParams` (SSG). First Contentful Paint (FCP) ditargetkan $< 1.2$ detik. |
| **SEO & Open Graph** | Dynamic metadata generator pada setiap rute tanggal (judul halaman unik, deskripsi memuat tanggal & nama warna, kata kunci zodiak, OpenGraph tags, Twitter Card). |
| **Responsivitas UI** | Mobile-first dengan dukungan penuh untuk layar ponsel cerdas, tablet, dan desktop besar. Navigasi kalender dan filter zodiak mendukung swipe/touch scroll dengan *snap alignment*. |
| **Aksesibilitas (a11y)** | Penggunaan semantik HTML5 (`<main>`, `<header>`, `<article>`, `<nav>`, `<section>`). Kontras teks berbasis kalkulasi luminansi matematika (`chroma.luminance() < 0.4 ? 'text-white' : 'text-gray-900'`). |
| **Privasi Pengguna** | 100% Client-side and static asset rendering. Tidak mengumpulkan data pribadi atau memerlukan otentikasi/login. |

---

## 5. Arsitektur Sistem & Spesifikasi Teknis

### 5.1 Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) 16.2.4 (App Router)
- **Library Inti**: [React](https://react.dev/) 19.2.4
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/) 5
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4 dengan PostCSS
- **Manipulasi Warna**: [chroma-js](https://gka.github.io/chroma.js/) v3.2.0
- **Export Raster Image**: [html-to-image](https://github.com/bubkoo/html-to-image) v1.11.13
- **Animasi**: Tailwind CSS Keyframes kustom (`animate-fade-up`)

### 5.2 Struktur Direktori Proyek
```text
my-birthday-color/
├── app/
│   ├── globals.css                       # Konfigurasi Tailwind v4 & keyframes animasi
│   ├── layout.tsx                        # Root layout & default global SEO metadata
│   ├── page.tsx                          # Beranda: Kalender 366 hari + Filter Zodiak
│   └── warna/
│       └── [month]/
│           └── [day]/
│               └── page.tsx              # Dynamic SSG page & generateMetadata
├── components/
│   └── ColorDetailClient.tsx             # Komponen interaktif: Palet, Copy, & Share
├── lib/
│   └── colorData.ts                      # Dataset 366 hari, tipe data & helper getZodiacSign
├── public/                               # Aset statis & favicon
├── package.json                          # Manifest dependensi & skrip NPM
└── tsconfig.json                         # Konfigurasi TypeScript
```

### 5.3 Skema Data (`BirthdayData`)
Dataset didefinisikan secara statis dan terstruktur di `lib/colorData.ts`:
```typescript
export type Horoscope = 
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' 
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' 
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export interface BirthdayData {
  month: number;        // 1 - 12
  day: number;          // 1 - 31 (termasuk 29 Februari)
  horoscope: Horoscope; // Zodiak terkait
  colorName: string;    // Nama warna unik
  hex: string;          // Kode warna HEX (#RRGGBB)
  meaning: string;      // Filosofi / arti karakter warna
}
```

---

## 6. Alur Pengguna (User Journey)

```mermaid
flowchart TD
    A[Pengguna Membuka Web Birthday Color] --> B{Pilih Filter Zodiak?}
    B -- Ya --> C[Klik Filter Zodiak Tertentu]
    B -- Tidak --> D[Lihat Semua 12 Kolom Bulan]
    C --> E[Kalender Menampilkan Tanggal Sesuai Zodiak]
    D --> F[Scroll Horisontal & Temukan Tanggal Lahir]
    E --> F
    F --> G[Klik Kartu Tanggal Tertentu]
    G --> H[Navigasi ke /warna/:month/:day]
    H --> I[Melihat Warna, Makna, Nilai RGB, & Palet Harmonis]
    I --> J{Aksi Pengguna}
    J -- Salin Kode --> K[Klik Kode HEX / Palet -> Muncul Toast Notifikasi]
    J -- Bagikan / Unduh --> L[Klik Tombol Unduh & Share IG]
    L --> M{Perangkat Mendukung Web Share API?}
    M -- Ya (Ponsel) --> N[Membuka Dialog Share Native OS (IG Story / WA)]
    M -- Tidak (Desktop) --> O[Mengunduh File PNG Otomatis]
```

---

## 7. Rencana Pengembangan Masa Depan (Product Roadmap)

### Fase 1: Optimasi Dasar (Current Release)
- [x] Dataset lengkap 366 hari (termasuk 29 Februari).
- [x] Filter zodiak dinamis.
- [x] Dynamic SSG dengan `generateStaticParams`.
- [x] Generator palet warna (Harmonis, Kontras, Dinamis).
- [x] Click-to-copy kode HEX dengan toast notifikasi.
- [x] Export kartu visual ke PNG & Web Share API integration.

### Fase 2: Peningkatan Interaktivitas & Desain (Completed)
- [x] **Quick Datepicker Input**: Input tanggal lahir instan di bagian header dan halaman detail (pilih tanggal & bulan langsung lompat ke halaman warna, dengan tombol pintas *"Hari Ini"*).
- [x] **Instagram Story Aspect Ratio**: Opsi ekspor kartu dengan format 9:16 (1080x1920) yang siap pakai untuk Instagram Stories & TikTok lengkap dengan tab preview interaktif.
- [x] **Animasi Transisi Halaman**: Implementasi animasi halus (*fade-up*, *fade-in*, *scale-in*, *staggered delay*, *float*) saat membuka halaman detail dan kartu.

### Fase 3: Fitur Komparasi & Sosial (Future Consideration)
- [ ] **Color Compatibility**: Fitur mengecek kecocokan/harmoni warna antara dua tanggal lahir (pasangan, sahabat, atau rekan kerja).
- [ ] **Dukungan Multi-Bahasa (i18n)**: Pilihan Bahasa Jepang, Bahasa Korea, Bahasa Perancis, Bahasa Indonesia, Bahasa Spanyol, Bahasa Jerman, Bahasa Mandarin, Bahasa India, Bahasa Belanda, Bahasa Vietnam, Bahasa Rusia, Bahasa Italia, Bahasa Arab, Bahasa Portugis, Bahasa Thailand, Bahasa Tagalog, Bahasa Turkish, dan Bahasa Inggris.
- [ ] **Favorite / Bookmark**: Menyimpan warna favorit ke penyimpanan lokal browser (*LocalStorage*).

---

## 8. Metrik Keberhasilan (KPIs)

1. **Engagement Rate**: Rata-rata durasi sesi dan jumlah kartu warna yang dibuka per pengguna.
2. **Share & Save Rate**: Rasio klik tombol *"Unduh & Share IG"* dibandingkan total kunjungan halaman detail.
3. **SEO Performance**: Peringkat kata kunci Google untuk kueri seperti *"warna lahir [tanggal bulan]"*, *"arti warna kelahiran"*, dan *"birthday color indonesia"*.
4. **Performa Teknis**: Skor Google Lighthouse $\ge 99$ untuk Performance, Accessibility, Best Practices, dan SEO.
