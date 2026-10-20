export type Horoscope = 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type ColorTemperature = 'Warm' | 'Cool' | 'Neutral';
export type ColorToneType = 'Pure Hue' | 'Tint' | 'Tone' | 'Shade';
export type ColorWheelCategory = 'Primary' | 'Secondary' | 'Tertiary' | 'Neutral';

export type ColorFamily =
  | 'Red'
  | 'Red-Orange'
  | 'Orange'
  | 'Yellow'
  | 'Yellow-Green'
  | 'Green'
  | 'Teal'
  | 'Blue'
  | 'Indigo'
  | 'Purple'
  | 'Pink'
  | 'Brown'
  | 'Gray'
  | 'Black'
  | 'White';

export interface ColorTheoryProfile {
  family: ColorFamily;
  familyLabel: string;
  temperature: ColorTemperature;
  temperatureLabel: string;
  temperatureIcon: string;
  temperatureDescription: string;
  toneType: ColorToneType;
  toneTypeLabel: string;
  toneTypeDescription: string;
  wheelCategory: ColorWheelCategory;
  wheelCategoryLabel: string;
  psychology: string;
  hsl: { h: number; s: number; l: number };
}

export interface BirthdayData {
  month: number;
  day: number;
  horoscope: Horoscope;
  colorName: string;
  hex: string;
  meaning: string;
  theory?: ColorTheoryProfile;
}

// Fungsi untuk menentukan Zodiak jika data spesifik belum ada di database
export const getZodiacSign = (day: number, month: number): Horoscope => {
  if ((month == 1 && day <= 20) || (month == 12 && day >= 22)) return 'Capricorn';
  if ((month == 1 && day >= 21) || (month == 2 && day <= 18)) return 'Aquarius';
  if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return 'Pisces';
  if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return 'Aries';
  if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return 'Taurus';
  if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return 'Gemini';
  if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return 'Cancer';
  if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return 'Leo';
  if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return 'Virgo';
  if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return 'Libra';
  if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return 'Scorpio';
  return 'Sagittarius';
};

/**
 * Analisis Teori Warna Lengkap (Berdasarkan Park University, IxDF, dan 99designs):
 * Menghitung koordinat HSL, klasifikasi Suhu (Warm/Cool/Neutral),
 * Variasi Nilai (Pure Hue/Tint/Tone/Shade), Kategori Roda Warna (Primary/Secondary/Tertiary/Neutral),
 * serta karakter psikologis warna.
 */
export function getColorTheory(hex: string): ColorTheoryProfile {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / delta + 2) * 60;
        break;
      case b:
        h = ((r - g) / delta + 4) * 60;
        break;
    }
  }

  const hDeg = Math.round(h);
  const sPct = Math.round(s * 100);
  const lPct = Math.round(l * 100);

  // Klasifikasi Tone Type (Nilai & Kejenuhan)
  let toneType: ColorToneType = 'Pure Hue';
  let toneTypeLabel = 'Hue Murni';
  let toneTypeDescription = 'Rona murni jenuh dengan vitalitas prima dan kejujuran ekspresi autentik.';

  if (l >= 0.88 && s <= 0.25) {
    toneType = 'Tint';
    toneTypeLabel = 'Tint (Pastel / Sangat Terang)';
    toneTypeDescription = 'Perpaduan rona dengan sentuhan putih dominan, menghadirkan kesan lembut, bersih, dan segar.';
  } else if (l <= 0.15) {
    toneType = 'Shade';
    toneTypeLabel = 'Shade (Pekat / Gelap)';
    toneTypeDescription = 'Perpaduan rona dengan sentuhan hitam pekat, menonjolkan wibawa, keteguhan karakter, dan kedalaman batin.';
  } else if (s <= 0.22) {
    toneType = 'Tone';
    toneTypeLabel = 'Tone (Teduh / Desaturasi)';
    toneTypeDescription = 'Perpaduan rona dengan abu-abu netral, menghasilkan karakter matang, bersahaja, dan penuh objektivitas.';
  } else if (l >= 0.70) {
    toneType = 'Tint';
    toneTypeLabel = 'Tint (Pastel Terang)';
    toneTypeDescription = 'Rona lembut berbalut putih yang memancarkan optimisme ramah, kelembutan hati, dan keterbukaan.';
  } else if (l <= 0.35) {
    toneType = 'Shade';
    toneTypeLabel = 'Shade (Pekat Mendalam)';
    toneTypeDescription = 'Rona kaya bernuansa gelap yang memancarkan intensitas, ketahanan batin, dan keanggunan eksklusif.';
  } else if (s <= 0.45) {
    toneType = 'Tone';
    toneTypeLabel = 'Tone (Teduh Seimbang)';
    toneTypeDescription = 'Rona tenang dengan saturasi teredam, menciptakan stabilitas emosi dan keharmonisan pandang.';
  }

  // Klasifikasi Keluarga & Roda Warna & Suhu
  let family: ColorFamily = 'Blue';
  let familyLabel = 'Keluarga Biru';
  let wheelCategory: ColorWheelCategory = 'Primary';
  let wheelCategoryLabel = 'Warna Primer';
  let temperature: ColorTemperature = 'Cool';
  let temperatureLabel = 'Dingin';
  let temperatureIcon = '❄️';
  let temperatureDescription = 'Membawa efek menenangkan pikiran, menyejukkan emosi, serta mendorong refleksi batin dan kepercayaan.';
  let psychology = 'Melambangkan ketenangan reflektif, integritas teguh, kepercayaan sejati, dan kedalaman intuisi yang menyejukkan.';

  if (l >= 0.95 && s <= 0.10) {
    family = 'White';
    familyLabel = 'Keluarga Putih';
    wheelCategory = 'Neutral';
    wheelCategoryLabel = 'Warna Netral';
    temperature = 'Neutral';
    temperatureLabel = 'Netral';
    temperatureIcon = '⚖️';
    temperatureDescription = 'Menghadirkan keseimbangan total tanpa bias emosi, memancarkan ruang kosong untuk kejelasan berpikir.';
    psychology = 'Melambangkan kemurnian niat, kejelasan lembaran baru, kesederhanaan elegan, dan kejujuran nurani.';
  } else if (l <= 0.12) {
    family = 'Black';
    familyLabel = 'Keluarga Hitam';
    wheelCategory = 'Neutral';
    wheelCategoryLabel = 'Warna Netral';
    temperature = 'Neutral';
    temperatureLabel = 'Netral';
    temperatureIcon = '⚖️';
    temperatureDescription = 'Memberikan perlindungan energi, ketegasan batasan diri, dan fondasi wibawa yang tenang.';
    psychology = 'Melambangkan kedalaman misteri batin, kekuatan prinsip yang tak goyah, martabat, dan proteksi diri.';
  } else if (s <= 0.12) {
    family = 'Gray';
    familyLabel = 'Keluarga Abu-abu';
    wheelCategory = 'Neutral';
    wheelCategoryLabel = 'Warna Netral';
    temperature = 'Neutral';
    temperatureLabel = 'Netral';
    temperatureIcon = '⚖️';
    temperatureDescription = 'Menjaga netralitas objektif, ketenangan di tengah dinamika emosi, dan keandalan yang stabil.';
    psychology = 'Melambangkan kedewasaan berpikir, ketenangan analitis, objektivitas seimbang, dan keanggunan abadi.';
  } else if (hDeg >= 15 && hDeg <= 48 && (l <= 0.40 || (s <= 0.52 && l <= 0.58))) {
    family = 'Brown';
    familyLabel = 'Keluarga Cokelat (Earthy)';
    wheelCategory = 'Neutral';
    wheelCategoryLabel = 'Warna Netral Bumi';
    temperature = 'Warm';
    temperatureLabel = 'Hangat';
    temperatureIcon = '🔥';
    temperatureDescription = 'Memberikan kehangatan alami yang membumi, rasa aman yang stabil, dan keteduhan relasi.';
    psychology = 'Melambangkan ketahanan kokoh, kesahajaan yang tulus, keandalan karakter, dan fondasi hidup yang mantap.';
  } else if (hDeg >= 345 || hDeg < 15) {
    family = 'Red';
    familyLabel = 'Keluarga Merah';
    wheelCategory = 'Primary';
    wheelCategoryLabel = 'Warna Primer';
    temperature = 'Warm';
    temperatureLabel = 'Hangat';
    temperatureIcon = '🔥';
    temperatureDescription = 'Menstimulasi energi denyut nadi, membangkitkan keberanian spontan, dan mendorong inisiatif aksi.';
    psychology = 'Melambangkan gairah hidup membara, vitalitas prima, keberanian memimpin, dan tekad tanpa gentar.';
  } else if (hDeg >= 15 && hDeg < 30) {
    family = 'Red-Orange';
    familyLabel = 'Keluarga Merah-Jingga';
    wheelCategory = 'Tertiary';
    wheelCategoryLabel = 'Warna Tersier';
    temperature = 'Warm';
    temperatureLabel = 'Hangat';
    temperatureIcon = '🔥';
    temperatureDescription = 'Memadukan ketegasan merah dan antusiasme oranye, menyalakan daya dorong kreatif yang dinamis.';
    psychology = 'Melambangkan dorongan aksi penuh semangat, spontanitas positif, dan daya pikat sosial yang atraktif.';
  } else if (hDeg >= 30 && hDeg < 48) {
    family = 'Orange';
    familyLabel = 'Keluarga Oranye (Jingga)';
    wheelCategory = 'Secondary';
    wheelCategoryLabel = 'Warna Sekunder';
    temperature = 'Warm';
    temperatureLabel = 'Hangat';
    temperatureIcon = '🔥';
    temperatureDescription = 'Memancarkan kehangatan sosial, keramahan terbuka, dan energi optimisme yang menular.';
    psychology = 'Melambangkan kreativitas ekspresif, antusiasme berpetualang, kehangatan empati, dan keceriaan jiwa.';
  } else if (hDeg >= 48 && hDeg < 68) {
    family = 'Yellow';
    familyLabel = 'Keluarga Kuning';
    wheelCategory = 'Primary';
    wheelCategoryLabel = 'Warna Primer';
    temperature = 'Warm';
    temperatureLabel = 'Hangat';
    temperatureIcon = '🔥';
    temperatureDescription = 'Menstimulasi proses mental kognitif, menerangi sudut pandang baru, dan menebarkan keceriaan.';
    psychology = 'Melambangkan kejernihan intelektual, optimisme masa depan, rasa ingin tahu cerdas, dan inspirasi segar.';
  } else if (hDeg >= 68 && hDeg < 88) {
    family = 'Yellow-Green';
    familyLabel = 'Keluarga Hijau-Kuning (Lime)';
    wheelCategory = 'Tertiary';
    wheelCategoryLabel = 'Warna Tersier';
    temperature = 'Warm';
    temperatureLabel = 'Hangat';
    temperatureIcon = '🔥';
    temperatureDescription = 'Jembatan antara kehangatan cahaya matahari dan kesuburan alam, membangkitkan vitalitas segar.';
    psychology = 'Melambangkan pembaruan ide, regenerasi semangat, keterbukaan pikiran, dan antusiasme tunas muda.';
  } else if (hDeg >= 88 && hDeg < 165) {
    family = 'Green';
    familyLabel = 'Keluarga Hijau';
    wheelCategory = 'Secondary';
    wheelCategoryLabel = 'Warna Sekunder';
    temperature = 'Cool';
    temperatureLabel = 'Dingin';
    temperatureIcon = '❄️';
    temperatureDescription = 'Menurunkan ketegangan saraf, menciptakan rasa tenteram, dan menyelaraskan ritme tubuh alami.';
    psychology = 'Melambangkan pertumbuhan berkelanjutan, harmoni emosional, kedamaian batin, dan welas asih tulus.';
  } else if (hDeg >= 165 && hDeg < 195) {
    family = 'Teal';
    familyLabel = 'Keluarga Teal / Toska';
    wheelCategory = 'Tertiary';
    wheelCategoryLabel = 'Warna Tersier';
    temperature = 'Cool';
    temperatureLabel = 'Dingin';
    temperatureIcon = '❄️';
    temperatureDescription = 'Menyegarkan konsentrasi pikiran, memperlancar ekspresi komunikasi, dan menenangkan emosi meluap.';
    psychology = 'Melambangkan kejernihan komunikasi, kesegaran persepsi, keseimbangan emosional, dan fleksibilitas cerdas.';
  } else if (hDeg >= 195 && hDeg < 255) {
    family = 'Blue';
    familyLabel = 'Keluarga Biru';
    wheelCategory = 'Primary';
    wheelCategoryLabel = 'Warna Primer';
    temperature = 'Cool';
    temperatureLabel = 'Dingin';
    temperatureIcon = '❄️';
    temperatureDescription = 'Menenangkan detak jantung, meredakan kecemasan, dan memperdalam pemikiran kontemplatif.';
    psychology = 'Melambangkan integritas teguh, kepercayaan sejati, kedalaman intuisi batin, dan kebijaksanaan hening.';
  } else if (hDeg >= 255 && hDeg < 285) {
    family = 'Indigo';
    familyLabel = 'Keluarga Nila (Indigo)';
    wheelCategory = 'Tertiary';
    wheelCategoryLabel = 'Warna Tersier';
    temperature = 'Cool';
    temperatureLabel = 'Dingin';
    temperatureIcon = '❄️';
    temperatureDescription = 'Menghubungkan logika rasional dengan kepekaan intuisi mendalam dan visi masa depan.';
    psychology = 'Melambangkan ketajaman persepsi intuitif, kedalaman spiritual, wawasan filosofis, dan fokus batin.';
  } else if (hDeg >= 285 && hDeg < 325) {
    family = 'Purple';
    familyLabel = 'Keluarga Ungu (Violet)';
    wheelCategory = 'Secondary';
    wheelCategoryLabel = 'Warna Sekunder';
    temperature = 'Cool';
    temperatureLabel = 'Dingin';
    temperatureIcon = '❄️';
    temperatureDescription = 'Memicu imajinasi kreatif bawah sadar, meningkatkan kepekaan estetika, dan membawa aura wibawa.';
    psychology = 'Melambangkan kemuliaan cita-cita, imajinasi artistik tinggi, martabat luhur, dan kebijaksanaan jiwa.';
  } else {
    family = 'Pink';
    familyLabel = 'Keluarga Merah Muda (Pink / Magenta)';
    wheelCategory = 'Tertiary';
    wheelCategoryLabel = 'Warna Tersier';
    temperature = 'Warm';
    temperatureLabel = 'Hangat';
    temperatureIcon = '🔥';
    temperatureDescription = 'Menghangatkan relasi interpersonal, melembutkan ketegangan hati, dan menebarkan empati ramah.';
    psychology = 'Melambangkan cinta kasih tulus, kelembutan tutur kata, empati mendalam, dan keharmonisan hubungan.';
  }

  return {
    family,
    familyLabel,
    temperature,
    temperatureLabel,
    temperatureIcon,
    temperatureDescription,
    toneType,
    toneTypeLabel,
    toneTypeDescription,
    wheelCategory,
    wheelCategoryLabel,
    psychology,
    hsl: { h: hDeg, s: sPct, l: lPct },
  };
}

export const birthdayColors: BirthdayData[] = [
  // JANUARI (Capricorn & Aquarius) - Elemen Tanah & Udara (Warna solid, dingin, stabil)
  { month: 1, day: 1, horoscope: 'Capricorn', colorName: 'Pure White', hex: '#FFFFFF', meaning: 'Kemurnian putih yang melambangkan kejelasan pikiran, ketulusan niat, dan keberanian membuka lembaran hidup baru.' },
  { month: 1, day: 2, horoscope: 'Capricorn', colorName: 'Frosty White', hex: '#F0F8FF', meaning: 'Sentuhan putih sejuk berembun yang memancarkan ketenangan jiwa, kejernihan berpikir, dan kedamaian batin.' },
  { month: 1, day: 3, horoscope: 'Capricorn', colorName: 'Silver Gray', hex: '#C0C0C0', meaning: 'Keanggunan perak netral yang mencerminkan kedewasaan emosi, ketajaman intuisi, dan kematangan bersikap.' },
  { month: 1, day: 4, horoscope: 'Capricorn', colorName: 'Aluminum Gray', hex: '#A9A9A9', meaning: 'Kekuatan rona abu-abu netral yang melambangkan ketahanan batin, stabilitas mental, dan fondasi kokoh.' },
  { month: 1, day: 5, horoscope: 'Capricorn', colorName: 'Steel Gray', hex: '#778899', meaning: 'Ketenangan abu-abu baja yang menegaskan fokus terarah, disiplin tinggi, dan ketegasan melangkah menuju tujuan.' },
  { month: 1, day: 6, horoscope: 'Capricorn', colorName: 'Grape Mouse', hex: '#5C4033', meaning: 'Kehangatan cokelat bumi pekat yang melambangkan ketekunan bekerja, kesabaran berproses, dan hasil yang matang.' },
  { month: 1, day: 7, horoscope: 'Capricorn', colorName: 'Jet Black', hex: '#0A0A0A', meaning: 'Kedalaman hitam pekat yang melambangkan kekuatan prinsip, wibawa elegan, dan perlindungan energi batin yang kokoh.' },
  { month: 1, day: 8, horoscope: 'Capricorn', colorName: 'Lemonade Yellow', hex: '#FDFD96', meaning: 'Pancaran kuning cerah lembut yang membawa kehangatan harapan, optimisme baru, dan fleksibilitas berpikir.' },
  { month: 1, day: 9, horoscope: 'Capricorn', colorName: 'Moss Green', hex: '#8A9A5B', meaning: 'Rona hijau lumut teduh yang mencerminkan ketekunan bertumbuh, kesabaran alami, dan ketahanan dalam berproses.' },
  { month: 1, day: 10, horoscope: 'Capricorn', colorName: 'Grass Green', hex: '#7CFC00', meaning: 'Kesegaran hijau rumput yang memancarkan vitalitas hidup, dedikasi yang konsisten, dan semangat bertumbuh.' },
  { month: 1, day: 11, horoscope: 'Capricorn', colorName: 'Mist Green', hex: '#C1D5C0', meaning: 'Keteduhan hijau berkabut yang menghadirkan kelembutan hati, kesabaran menanti waktu, dan kedamaian rasa.' },
  { month: 1, day: 12, horoscope: 'Capricorn', colorName: 'Slate Mountain', hex: '#34495E', meaning: 'Kedalaman biru batu gunung yang melambangkan keteguhan ambisi, integritas tinggi, dan struktur hidup yang kokoh.' },
  { month: 1, day: 13, horoscope: 'Capricorn', colorName: 'Parrot Green', hex: '#32CD32', meaning: 'Vitalitas hijau cerah yang memadukan ketangkasan berpikir, kejernihan komunikasi, dan keteraturan gagasan.' },
  { month: 1, day: 14, horoscope: 'Capricorn', colorName: 'Deep Olive', hex: '#556B2F', meaning: 'Kematangan rona zaitun teduh yang memancarkan kebijaksanaan berharga, kedewasaan jiwa, dan keandalan budi.' },
  { month: 1, day: 15, horoscope: 'Capricorn', colorName: 'Dark Green', hex: '#013220', meaning: 'Kedalaman hijau hutan pekat yang mencerminkan fokus jangka panjang, ketahanan prinsip, dan visi masa depan yang tenang.' },
  { month: 1, day: 16, horoscope: 'Capricorn', colorName: 'White Lily', hex: '#F8F8FF', meaning: 'Kelembutan putih bunga lili yang memancarkan ketulusan niat, kebersihan integritas, dan dedikasi yang anggun.' },
  { month: 1, day: 17, horoscope: 'Capricorn', colorName: 'Sprout Green', hex: '#90EE90', meaning: 'Kesegaran hijau tunas muda yang melambangkan keterbukaan ide, pembaruan gagasan praktis, dan optimisme berkembang.' },
  { month: 1, day: 18, horoscope: 'Capricorn', colorName: 'Foliage', hex: '#4B5320', meaning: 'Kekuatan hijau dedaunan alami yang mencerminkan ketahanan batin, adaptabilitas tinggi, dan sikap realistis.' },
  { month: 1, day: 19, horoscope: 'Capricorn', colorName: 'Leaf Green', hex: '#228B22', meaning: 'Keseimbangan hijau daun yang melambangkan pertumbuhan stabil, kemapanan mental, dan harmoni hidup berkelanjutan.' },
  { month: 1, day: 20, horoscope: 'Aquarius', colorName: 'Forest Green', hex: '#2E8B57', meaning: 'Ketenangan hijau laut dalam yang menjembatani kepekaan intuisi, kepedulian sosial, dan empati kemanusiaan.' },
  { month: 1, day: 21, horoscope: 'Aquarius', colorName: 'Sky Blue', hex: '#87CEEB', meaning: 'Keluasan biru langit cerah yang memancarkan kebebasan berpikir, visi futuristik, dan keterbukaan tanpa batas.' },
  { month: 1, day: 22, horoscope: 'Aquarius', colorName: 'Pale Cyan', hex: '#E0FFFF', meaning: 'Kejernihan sian es yang melambangkan inovasi segar, pemikiran orisinal out-of-the-box, dan kecerdasan modern.' },
  { month: 1, day: 23, horoscope: 'Aquarius', colorName: 'Dayflower Blue', hex: '#4682B4', meaning: 'Kedalaman biru bunga liar yang memancarkan keunikan jati diri, keberanian berekspresi, dan visi yang jelas.' },
  { month: 1, day: 24, horoscope: 'Aquarius', colorName: 'Teal Wing', hex: '#008080', meaning: 'Keanggunan hijau-biru toska yang menyelaraskan ketajaman logika berpikir dengan kedalaman imajinasi kreatif.' },
  { month: 1, day: 25, horoscope: 'Aquarius', colorName: 'Deep Indigo', hex: '#191970', meaning: 'Kedalaman nila malam pekat yang mencerminkan wawasan filosofis luas, persepsi intuitif, dan pemahaman semesta.' },
  { month: 1, day: 26, horoscope: 'Aquarius', colorName: 'Ice Cream', hex: '#FDF5E6', meaning: 'Kelembutan rona krem hangat yang memancarkan keramahan, keterbukaan menyambut ide baru, dan kehangatan relasi.' },
  { month: 1, day: 27, horoscope: 'Aquarius', colorName: 'Pale Lemon', hex: '#FFFACD', meaning: 'Kecerahan kuning lemon lembut yang memancarkan harapan segar, optimisme sosial, dan keceriaan yang menular.' },
  { month: 1, day: 28, horoscope: 'Aquarius', colorName: 'Dandelion', hex: '#FFD700', meaning: 'Kemilau kuning emas yang memancarkan inspirasi bercahaya, kemurahan hati, dan energi positif bagi sekitar.' },
  { month: 1, day: 29, horoscope: 'Aquarius', colorName: 'Spring Grass', hex: '#00FF7F', meaning: 'Dinamisme hijau musim semi yang melambangkan gebrakan pembaruan, reformasi progresif, dan semangat regenerasi.' },
  { month: 1, day: 30, horoscope: 'Aquarius', colorName: 'Meadow Green', hex: '#3CB371', meaning: 'Keseimbangan hijau padang rumput yang mencerminkan kemandirian sejati, harmoni batin, dan ketenteraman hidup.' },
  { month: 1, day: 31, horoscope: 'Aquarius', colorName: 'Bud Green', hex: '#7CFC00', meaning: 'Pancaran hijau tunas cerah yang menandai keberanian memulai hal baru, revolusi ide segar, dan optimisme masa depan.' },

  // FEBRUARI (Aquarius & Pisces) - Elemen Udara & Air (Transisi inovasi ke emosi mendalam)
  { month: 2, day: 1, horoscope: 'Aquarius', colorName: 'Cornflower Blue', hex: '#6495ED', meaning: 'Kejernihan biru bunga cornflower yang memancarkan ketulusan niat, idealisme tinggi, dan loyalitas batin.' },
  { month: 2, day: 2, horoscope: 'Aquarius', colorName: 'Young Purple', hex: '#9370DB', meaning: 'Keanggunan ungu muda yang menyelaraskan ketajaman logika berpikir dengan persepsi intuisi yang mendalam.' },
  { month: 2, day: 3, horoscope: 'Aquarius', colorName: 'Electric Cyan', hex: '#00FFFF', meaning: 'Kilau sian elektrik yang memancarkan orisinalitas ide, daya cipta visioner, dan pandangan masa depan cemerlang.' },
  { month: 2, day: 4, horoscope: 'Aquarius', colorName: 'Wisteria Purple', hex: '#C9A0DC', meaning: 'Kreativitas ungu wisteria lembut yang menghadirkan imajinasi artistik, kepekaan rasa, dan inovasi yang tak terduga.' },
  { month: 2, day: 5, horoscope: 'Aquarius', colorName: 'Pansy Purple', hex: '#78184A', meaning: 'Ketegasan ungu pansy pekat yang melambangkan keberanian tampil autentik, wibawa karakter, dan orisinalitas diri.' },
  { month: 2, day: 6, horoscope: 'Aquarius', colorName: 'Pale Lilac', hex: '#DCD0FF', meaning: 'Kelembutan ungu lilac pastel yang memancarkan empati sosial mendalam, kepekaan hati, dan ketulusan berbagi.' },
  { month: 2, day: 7, horoscope: 'Aquarius', colorName: 'Mauvette', hex: '#E0B0FF', meaning: 'Keseimbangan lembayung mauve yang memadukan daya analisis intelektual dengan keindahan rasa artistik.' },
  { month: 2, day: 8, horoscope: 'Aquarius', colorName: 'Burgundy', hex: '#800020', meaning: 'Kedalaman merah anggur pekat yang menyalakan gairah batin membara, komitmen teguh, dan kekuatan tekad tersembunyi.' },
  { month: 2, day: 9, horoscope: 'Aquarius', colorName: 'Fuchsia Purple', hex: '#CC397B', meaning: 'Keanggunan merah crimson yang memancarkan keberanian berpendapat, dedikasi penuh gairah, dan ketegasan sikap.' },
  { month: 2, day: 10, horoscope: 'Aquarius', colorName: 'Rose Red', hex: '#FF007F', meaning: 'Vitalitas merah mawar cerah yang melambangkan cinta kasih pada kemanusiaan, keberanian bertindak, dan daya tarik hangat.' },
  { month: 2, day: 11, horoscope: 'Aquarius', colorName: 'Crimson', hex: '#DC143C', meaning: 'Pancaran hijau limau segar yang menghidupkan keceriaan intelektual, pembaruan sudut pandang, dan energi dinamis.' },
  { month: 2, day: 12, horoscope: 'Aquarius', colorName: 'Carmine', hex: '#960018', meaning: 'Kecerahan kuning mustar yang memancarkan rasa ingin tahu tajam, ketelitian observasi, dan kecerdasan berpikir.' },
  { month: 2, day: 13, horoscope: 'Aquarius', colorName: 'Nightingale', hex: '#C0D860', meaning: 'Keteduhan hijau zaitun lembut yang membawa pesan kedamaian batin, harmoni sosial, dan kesabaran menyimak.' },
  { month: 2, day: 14, horoscope: 'Aquarius', colorName: 'Seaweed Green', hex: '#2E8B57', meaning: 'Kejernihan biru kobalt cerah yang melambangkan kesetiaan batin, keteguhan prinsip, dan ketulusan persahabatan sejati.' },
  { month: 2, day: 15, horoscope: 'Aquarius', colorName: 'Forget-me-not', hex: '#1E90FF', meaning: 'Keluasan biru forget-me-not yang mencerminkan ketajaman memori, penghargaan atas kenangan berharga, dan kehangatan rasa.' },
  { month: 2, day: 16, horoscope: 'Aquarius', colorName: 'Smoke Blue', hex: '#708090', meaning: 'Kedalaman biru laut safir yang menghadirkan ketenangan reflektif, kejujuran nurani, dan kebijaksanaan hening.' },
  { month: 2, day: 17, horoscope: 'Aquarius', colorName: 'Smalt', hex: '#003399', meaning: 'Ketenangan biru malam yang menegaskan kekuatan pemikiran mandiri, keteguhan hati, dan stabilitas emosi.' },
  { month: 2, day: 18, horoscope: 'Aquarius', colorName: 'Chocolate', hex: '#D2691E', meaning: 'Kehangatan cokelat hangat yang memancarkan rasa aman, keramahan yang merangkul, dan kenyamanan hidup berkomunitas.' },
  { month: 2, day: 19, horoscope: 'Pisces', colorName: 'Navy Blue', hex: '#000080', meaning: 'Kedalaman biru laut dalam yang melambangkan luasnya samudra empati, kepekaan rasa, dan intuisi spiritual hening.' },
  { month: 2, day: 20, horoscope: 'Pisces', colorName: 'Eggshell', hex: '#F0EAD6', meaning: 'Kelembutan biru pastel lembut yang menghadirkan kepolosan hati, kedamaian pikiran, dan ketenangan jiwa yang damai.' },
  { month: 2, day: 21, horoscope: 'Pisces', colorName: 'Lime Light', hex: '#E3FF00', meaning: 'Kilau kuning limau bercahaya yang memancarkan imajinasi artistik hidup, inspirasi segar, dan daya cipta puitis.' },
  { month: 2, day: 22, horoscope: 'Pisces', colorName: 'Turmeric', hex: '#FFC000', meaning: 'Kehangatan kuning kunyit alami yang membawa energi penyembuhan emosional, optimisme cerah, dan vitalitas batin.' },
  { month: 2, day: 23, horoscope: 'Pisces', colorName: 'Mustard Flower', hex: '#FFDB58', meaning: 'Kelembutan abu-abu mutiara yang melambangkan kemurnian intuisi, kepekaan perasaan yang halus, dan keheningan reflektif.' },
  { month: 2, day: 24, horoscope: 'Pisces', colorName: 'Reed Green', hex: '#7C9082', meaning: 'Fleksibilitas hijau buluh air yang mencerminkan kemampuan beradaptasi luwes, ketahanan batin, dan keikhlasan jiwa.' },
  { month: 2, day: 25, horoscope: 'Pisces', colorName: 'Mist White', hex: '#E6E6FA', meaning: 'Kemurnian putih berkabut lavender yang memancarkan spiritualitas hening, ketulusan doa, dan intuisi yang jernih.' },
  { month: 2, day: 26, horoscope: 'Pisces', colorName: 'Leaf Reverse', hex: '#8F9779', meaning: 'Ketenangan hijau toska tenang yang menyembuhkan keresahan hati, mendamaikan emosi, dan menumbuhkan welas asih.' },
  { month: 2, day: 27, horoscope: 'Pisces', colorName: 'Willow Tea', hex: '#C1D8C3', meaning: 'Kedalaman nila laut misterius yang mencerminkan imajinasi tanpa tepi, kedalaman rasa, dan penghayatan makna hidup.' },
  { month: 2, day: 28, horoscope: 'Pisces', colorName: 'Olive Green', hex: '#BAB86C', meaning: 'Keteduhan hijau zaitun lembut yang memancarkan harapan akan kedamaian abadi, kerendahan hati, dan ketenangan rasa.' },
  { month: 2, day: 29, horoscope: 'Pisces', colorName: 'Ivy Green', hex: '#41924B', meaning: 'Keanggunan ungu amethyst langka yang melambangkan kebijaksanaan spiritual tinggi, intuisi magis, dan keabadian jiwa.' },

  // MARET (Pisces & Aries) - Elemen Air & Api (Mimpi yang berubah menjadi aksi)
  { month: 3, day: 1, horoscope: 'Pisces', colorName: 'Pale Salmon', hex: '#FF9999', meaning: 'Kelembutan salmon lembut yang memancarkan cinta kasih tanpa pamrih, kehangatan empati, dan ketulusan merawat.' },
  { month: 3, day: 2, horoscope: 'Pisces', colorName: 'Baby Pink', hex: '#F4C2C2', meaning: 'Kepolosan merah muda bayi yang mencerminkan kemurnian hati, kelembutan tutur kata, dan kasih sayang tulus.' },
  { month: 3, day: 3, horoscope: 'Pisces', colorName: 'Crested Ibis', hex: '#F5C4CB', meaning: 'Kehalusan rona merah muda ibis yang memancarkan sensitivitas rasa, keanggunan budi, dan kehangatan merangkul sesama.' },
  { month: 3, day: 4, horoscope: 'Pisces', colorName: 'Poppy Red', hex: '#E25822', meaning: 'Semangat merah jingga bunga poppy yang menyalakan impian penuh gairah, keberanian bermimpi, dan vitalitas batin.' },
  { month: 3, day: 5, horoscope: 'Pisces', colorName: 'Cherry Red', hex: '#D2042D', meaning: 'Daya pikat merah ceri cerah yang melambangkan daya tarik romantis, pesona magnetis, dan keberanian berekspresi.' },
  { month: 3, day: 6, horoscope: 'Pisces', colorName: 'Cherry Blossom', hex: '#FFB7C5', meaning: 'Keindahan merah muda sakura yang mengajarkan rasa syukur mendalam, keindahan momen berharga, dan ketenangan rasa.' },
  { month: 3, day: 7, horoscope: 'Pisces', colorName: 'Salmon Pink', hex: '#FF91A4', meaning: 'Keseimbangan rona merah muda salmon yang menyelaraskan keikhlasan memberi dengan ketulusan menerima kebaikan.' },
  { month: 3, day: 8, horoscope: 'Pisces', colorName: 'Plum Blossom', hex: '#E86F68', meaning: 'Keteguhan merah koral bunga prem yang melambangkan ketahanan dalam kelembutan dan keberanian bangkit dari ujian.' },
  { month: 3, day: 9, horoscope: 'Pisces', colorName: 'Coral', hex: '#FF7F50', meaning: 'Kelembutan merah muda pudar yang menenangkan gelombang emosi, memancarkan kedamaian batin, dan kesabaran hati.' },
  { month: 3, day: 10, horoscope: 'Pisces', colorName: 'Dreamy Lavender', hex: '#E6E6FA', meaning: 'Kecerahan merah fajar yang memancarkan optimisme segar, harapan membara, dan keberanian menyongsong babak baru.' },
  { month: 3, day: 11, horoscope: 'Pisces', colorName: 'Clay Powder', hex: '#D4B8B1', meaning: 'Kehangatan merah terakota yang melambangkan ketulusan yang membumi, kedewasaan emosi, dan fondasi cinta yang kokoh.' },
  { month: 3, day: 12, horoscope: 'Pisces', colorName: 'Orange Vermillion', hex: '#FF4500', meaning: 'Keanggunan merah mawar pekat yang memancarkan gairah hidup mulia, integritas hati, dan pesona karakter yang kuat.' },
  { month: 3, day: 13, horoscope: 'Pisces', colorName: 'Persimmon', hex: '#ED4C07', meaning: 'Keceriaan merah muda teratai yang menyimbolkan kebangkitan jiwa, kemurnian cinta batin, dan kedamaian rasa.' },
  { month: 3, day: 14, horoscope: 'Pisces', colorName: 'Scarlet', hex: '#FF2400', meaning: 'Kehangatan merah vermilion lembut yang memadukan semangat inisiatif dengan kelembutan kasih sayang yang tulus.' },
  { month: 3, day: 15, horoscope: 'Pisces', colorName: 'Rouge', hex: '#A23B6C', meaning: 'Ketenangan merah bata teduh yang melambangkan kestabilan emosional, ketabahan hati, dan kesetiaan yang tak tergoyahkan.' },
  { month: 3, day: 16, horoscope: 'Pisces', colorName: 'Pale Wisteria', hex: '#E1C4FF', meaning: 'Dinamisme merah jingga koral yang memancarkan keramahan ceria, keterbukaan hati, dan energi positif yang menular.' },
  { month: 3, day: 17, horoscope: 'Pisces', colorName: 'Mauve', hex: '#E0B0FF', meaning: 'Pesona merah jambu cerah yang menyalakan inspirasi kreatif, keceriaan bermain, dan kehangatan persahabatan.' },
  { month: 3, day: 18, horoscope: 'Pisces', colorName: 'Campanula Purple', hex: '#8786BF', meaning: 'Kematangan merah delima pekat yang memancarkan kekuatan tekad batin, kemuliaan budi, dan perlindungan penuh kasih.' },
  { month: 3, day: 19, horoscope: 'Pisces', colorName: 'Violet', hex: '#8F00FF', meaning: 'Kedalaman merah marun mistis yang melambangkan penghayatan makna batin, transformasi jiwa, dan wawasan mendalam.' },
  { month: 3, day: 20, horoscope: 'Pisces', colorName: 'Ancient Purple', hex: '#895B8A', meaning: 'Keagungan ungu kuno bersejarah yang memancarkan kebijaksanaan spiritual tingkat tinggi, intuisi agung, dan kematangan rasa.' },
  { month: 3, day: 21, horoscope: 'Aries', colorName: 'Pale Orchid', hex: '#E6A8D7', meaning: 'Pancaran merah kirmizi membara yang menandai letupan inisiatif berani, kepemimpinan dinamis, dan api semangat baru.' },
  { month: 3, day: 22, horoscope: 'Aries', colorName: 'Deep Mauve', hex: '#D473D4', meaning: 'Vitalitas merah darah cerah yang melambangkan keberanian menerobos rintangan, energi prima, dan dorongan aksi nyata.' },
  { month: 3, day: 23, horoscope: 'Aries', colorName: 'Edo Purple', hex: '#745399', meaning: 'Keberanian merah api menyala yang menegaskan kemandirian tanpa rasa takut, ketangkasan berpikir, dan jiwa pelopor.' },
  { month: 3, day: 24, horoscope: 'Aries', colorName: 'Mallow', hex: '#E290B2', meaning: 'Semangat merah bata menyala yang memancarkan daya juang tak kenal lelah, fokus sasaran yang jelas, dan ketangguhan mental.' },
  { month: 3, day: 25, horoscope: 'Aries', colorName: 'Crimson Spark', hex: '#DC143C', meaning: 'Kekuatan merah rubi cemerlang yang mencerminkan harga diri kokoh, kepemimpinan berwibawa, dan ketulusan komitmen.' },
  { month: 3, day: 26, horoscope: 'Aries', colorName: 'Silver Green', hex: '#8FBC8F', meaning: 'Dinamisme merah jingga menyala yang memadukan kecepatan aksi dengan antusiasme tinggi untuk menciptakan perubahan nyata.' },
  { month: 3, day: 27, horoscope: 'Aries', colorName: 'Opal Green', hex: '#00FF7F', meaning: 'Keceriaan merah fuchsia yang memancarkan pesona magnetis, spontanitas berani, dan rasa percaya diri yang memukau.' },
  { month: 3, day: 28, horoscope: 'Aries', colorName: 'Pale Aqua', hex: '#BCD4E6', meaning: 'Keberanian merah marun tegas yang melambangkan ketahanan mental luar biasa, tekad bulat, dan daya tahan menghadapi tantangan.' },
  { month: 3, day: 29, horoscope: 'Aries', colorName: 'Spray Green', hex: '#9FE2BF', meaning: 'Pancaran merah anggur membara yang mencerminkan intensitas tujuan, ketajaman insting bersaing, dan kemenangan tekad.' },
  { month: 3, day: 30, horoscope: 'Aries', colorName: 'Pastel Blue', hex: '#AEC6CF', meaning: 'Energi merah koral cerah yang memadukan keberanian berinisiatif dengan kehangatan merangkul orang lain menuju keberhasilan.' },
  { month: 3, day: 31, horoscope: 'Aries', colorName: 'Straw', hex: '#E4D96F', meaning: 'Kekuatan merah garnet pekat yang menyimbolkan puncak determinasi diri, ketahanan batin tak goyah, dan kepemimpinan sejati.' },

  // APRIL (Aries & Taurus) - Elemen Api & Tanah (Dari inisiatif ke konsistensi)
  { month: 4, day: 1, horoscope: 'Aries', colorName: 'Pale Cherry', hex: '#FFB7C5', meaning: 'Kesegaran merah muda ceri yang memancarkan optimisme membara, keberanian memulai dari awal, dan harapan bersemi.' },
  { month: 4, day: 2, horoscope: 'Aries', colorName: 'Shell Pink', hex: '#FFB6C1', meaning: 'Kelembutan merah muda cangkang kerang yang memadukan daya tahan pantang menyerah dengan ketulusan budi yang halus.' },
  { month: 4, day: 3, horoscope: 'Aries', colorName: 'Fuchsia Pink', hex: '#FF77FF', meaning: 'Ledakan energi merah fuchsia cerah yang memancarkan vitalitas dinamis, keberanian bersuara, dan kepercayaan diri.' },
  { month: 4, day: 4, horoscope: 'Aries', colorName: 'Deep Orchid Pink', hex: '#E29CD2', meaning: 'Keteguhan merah muda anggrek yang melambangkan daya juang tangguh, kemuliaan cita-cita, dan keberanian tampil beda.' },
  { month: 4, day: 5, horoscope: 'Aries', colorName: 'Blue Wisteria', hex: '#84A2D4', meaning: 'Ketangkasan biru wisteria yang menyelaraskan inisiatif cepat bertindak dengan ketajaman logika strategi yang jernih.' },
  { month: 4, day: 6, horoscope: 'Aries', colorName: 'Chalk Blue', hex: '#5688B0', meaning: 'Inisiatif biru kapur yang memancarkan kepemimpinan berwibawa, ketenangan mengambil keputusan, dan ketegasan arah.' },
  { month: 4, day: 7, horoscope: 'Aries', colorName: 'White Lily', hex: '#F8F8FF', meaning: 'Kemurnian putih bunga lili yang melambangkan kepercayaan diri kokoh, kebersihan niat, dan ketulusan melayani sesama.' },
  { month: 4, day: 8, horoscope: 'Aries', colorName: 'Pale Green', hex: '#98FB98', meaning: 'Pembaruan hijau pucuk muda yang menandai awal yang dinamis, kesegaran gagasan kreatif, dan vitalitas bertumbuh.' },
  { month: 4, day: 9, horoscope: 'Aries', colorName: 'Gardenia', hex: '#F7E7CE', meaning: 'Keanggunan cokelat madu alami yang mencerminkan ketekunan bekerja, kestabilan emosional, dan apresiasi nilai hidup.' },
  { month: 4, day: 10, horoscope: 'Aries', colorName: 'Pumpkin', hex: '#FF7518', meaning: 'Kekuatan cokelat kayu cendana yang memancarkan ketenangan batin, keandalan memegang janji, dan watak yang membumi.' },
  { month: 4, day: 11, horoscope: 'Aries', colorName: 'Steamed Chestnut', hex: '#DBC381', meaning: 'Keteguhan cokelat kastanye kukus yang melambangkan kemauan baja, ketabahan menghadapi rintangan, dan tekad bulat.' },
  { month: 4, day: 12, horoscope: 'Aries', colorName: 'Tea White', hex: '#E5D6A7', meaning: 'Ketenangan cokelat tanah lempung yang mencerminkan kesabaran berproses, ketelitian kerja, dan stabilitas fondasi hidup.' },
  { month: 4, day: 13, horoscope: 'Aries', colorName: 'Frosty Gray', hex: '#E6E8FA', meaning: 'Kematangan cokelat kopi yang melambangkan kedewasaan berpikir, daya tahan menghadapi tekanan, dan keteguhan prinsip.' },
  { month: 4, day: 14, horoscope: 'Aries', colorName: 'Mouse Gray', hex: '#787C85', meaning: 'Kedalaman cokelat kenari yang mencerminkan wibawa tenang, kebijaksanaan mengelola sumber daya, dan keandalan diri.' },
  { month: 4, day: 15, horoscope: 'Aries', colorName: 'Pale Mist White', hex: '#E8EDF2', meaning: 'Kehangatan cokelat kayu manis yang memadukan keramahan bersahaja dengan semangat membangun kemakmuran bersama.' },
  { month: 4, day: 16, horoscope: 'Aries', colorName: 'Sky Gray', hex: '#B8C3D3', meaning: 'Ketahanan abu-abu perak teduh yang melambangkan ketenangan menimbang risiko, objektivitas, dan kematangan mental.' },
  { month: 4, day: 17, horoscope: 'Aries', colorName: 'Battleship Gray', hex: '#848482', meaning: 'Ketahanan abu-abu kapal perang yang melambangkan mental pejuang sejati, disiplin tak tergoyahkan, dan ketangguhan batin.' },
  { month: 4, day: 18, horoscope: 'Aries', colorName: 'Slate Gray', hex: '#708090', meaning: 'Kekokohan abu-abu sabak yang mencerminkan ketahanan fisik dan mental, integritas teguh, dan kestabilan langkah.' },
  { month: 4, day: 19, horoscope: 'Aries', colorName: 'Charcoal', hex: '#36454F', meaning: 'Ketenangan abu-abu arang pekat yang melambangkan wibawa terukur, penguasaan emosi yang matang, dan proteksi diri.' },
  { month: 4, day: 20, horoscope: 'Taurus', colorName: 'Young Seedling', hex: '#90EE90', meaning: 'Kesuburan hijau zamrud cerah yang melambangkan kemakmuran alami, ketekunan membangun masa depan, dan stabilitas hidup.' },
  { month: 4, day: 21, horoscope: 'Taurus', colorName: 'Fresh Greens', hex: '#00FF00', meaning: 'Keindahan hijau giok alami yang mencerminkan ketenangan jiwa, keharmonisan relasi, dan penghargaan pada keindahan.' },
  { month: 4, day: 22, horoscope: 'Taurus', colorName: 'Parrot Green', hex: '#32CD32', meaning: 'Keseimbangan hijau daun sage yang melambangkan kebijaksanaan praktis, kesabaran memupuk hasil, dan kedamaian batin.' },
  { month: 4, day: 23, horoscope: 'Taurus', colorName: 'Reed Leaf', hex: '#8F9779', meaning: 'Kesegaran hijau lumut muda yang memancarkan keteguhan bertumbuh, kesetiaan pada proses, dan keharmonisan hidup.' },
  { month: 4, day: 24, horoscope: 'Taurus', colorName: 'Sprout', hex: '#A2E4B8', meaning: 'Kekayaan hijau hutan pinus yang mencerminkan ketahanan jangka panjang, kemandirian finansial, dan stabilitas karakter.' },
  { month: 4, day: 25, horoscope: 'Taurus', colorName: 'Herb', hex: '#4B5320', meaning: 'Keanggunan hijau zaitun emas yang melambangkan kemakmuran yang berkah, kerendahan hati, dan ketulusan persahabatan.' },
  { month: 4, day: 26, horoscope: 'Taurus', colorName: 'Deep Pea Green', hex: '#2E8B57', meaning: 'Ketenangan hijau apel muda yang memancarkan kepuasan batin, rasa syukur atas nikmat sederhana, dan optimisme mekar.' },
  { month: 4, day: 27, horoscope: 'Taurus', colorName: 'Emerald Green', hex: '#50C878', meaning: 'Keteguhan hijau lumut tua yang mencerminkan ketabahan melewati musim kehidupan, konsistensi tekad, dan keandalan budi.' },
  { month: 4, day: 28, horoscope: 'Taurus', colorName: 'Turquoise Green', hex: '#A0D6B4', meaning: 'Keseimbangan hijau toska bumi yang menyelaraskan apresiasi keindahan material dengan kedamaian spiritual yang menenteramkan.' },
  { month: 4, day: 29, horoscope: 'Taurus', colorName: 'Pale Cyan', hex: '#87D3F8', meaning: 'Kedalaman hijau lumut rimba yang melambangkan fondasi kekayaan batin, kesabaran memetik hasil, dan perlindungan keluarga.' },
  { month: 4, day: 30, horoscope: 'Taurus', colorName: 'Azure Blue', hex: '#007FFF', meaning: 'Kesuburan hijau dedaunan lebat yang menandai kematangan pencapaian, rasa aman sejati, dan kesejahteraan berkelanjutan.' },

  // MEI (Taurus & Gemini) - Elemen Tanah & Udara (Kestabilan bergeser ke rasa ingin tahu)
  { month: 5, day: 1, horoscope: 'Taurus', colorName: 'Turquoise', hex: '#40E0D0', meaning: 'Kejernihan toska cerah yang memancarkan apresiasi tinggi pada kualitas hidup, keindahan estetika, dan ketenangan jiwa.' },
  { month: 5, day: 2, horoscope: 'Taurus', colorName: 'Earthy Emerald', hex: '#2ECC71', meaning: 'Kesuburan hijau zamrud alami yang melambangkan kestabilan finansial, pertumbuhan berkesinambungan, dan watak membumi.' },
  { month: 5, day: 3, horoscope: 'Taurus', colorName: 'Teal Green', hex: '#008080', meaning: 'Ketenangan hijau toska pekat yang memadukan pertimbangan praktis, kehati-hatian finansial, dan keandalan karakter.' },
  { month: 5, day: 4, horoscope: 'Taurus', colorName: 'Teal Blue', hex: '#367588', meaning: 'Kedalaman biru toska laut yang mencerminkan keteguhan memegang komitmen, loyalitas teguh, dan ketenangan bersikap.' },
  { month: 5, day: 5, horoscope: 'Taurus', colorName: 'Light Blue', hex: '#ADD8E6', meaning: 'Kelembutan biru muda langit yang menghadirkan kedamaian dalam rutinitas harian, kesabaran batin, dan kenyamanan relasi.' },
  { month: 5, day: 6, horoscope: 'Taurus', colorName: 'Forget-me-not Blue', hex: '#66B2FF', meaning: 'Kecerahan biru langit cerah yang memancarkan optimisme tulus, ketulusan persahabatan, dan kelegaan pikiran.' },
  { month: 5, day: 7, horoscope: 'Taurus', colorName: 'Ultramarine', hex: '#120A8F', meaning: 'Ketenangan biru telaga teduh yang mencerminkan ketabahan menghadapi dinamika hidup, kesetiaan, dan ketenteraman rasa.' },
  { month: 5, day: 8, horoscope: 'Taurus', colorName: 'Thousand Year Green', hex: '#315535', meaning: 'Keluasan biru samudra yang melambangkan kematangan emosi, stabilitas fondasi hidup, dan kebijaksanaan bersikap.' },
  { month: 5, day: 9, horoscope: 'Taurus', colorName: 'Parakeet Green', hex: '#55C6A9', meaning: 'Keanggunan biru safir lembut yang memadukan apresiasi nilai estetika dengan kejujuran nurani yang menyejukkan.' },
  { month: 5, day: 10, horoscope: 'Taurus', colorName: 'Eggshell', hex: '#F0EAD6', meaning: 'Keseimbangan hijau lumut berair yang melambangkan kesuburan ide praktis, keharmonisan rumah tangga, dan ketabahan hati.' },
  { month: 5, day: 11, horoscope: 'Taurus', colorName: 'Lettuce Green', hex: '#BEE687', meaning: 'Kesegaran hijau selada muda yang menghadirkan nutrisi bagi jiwa, pembaruan semangat, dan kepuasan atas hasil kerja.' },
  { month: 5, day: 12, horoscope: 'Taurus', colorName: 'Chartreuse Yellow', hex: '#DFFF00', meaning: 'Keteduhan hijau daun mint yang memancarkan ketenangan saraf, kejernihan berpikir, dan kelembutan tutur kata.' },
  { month: 5, day: 13, horoscope: 'Taurus', colorName: 'Dry Grass', hex: '#E4D5B7', meaning: 'Kesegaran hijau apel cerah yang melambangkan kebahagiaan bersahaja, kepolosan hati, dan optimisme mekar.' },
  { month: 5, day: 14, horoscope: 'Taurus', colorName: 'Olive', hex: '#808000', meaning: 'Kekuatan hijau zaitun pekat yang mencerminkan benteng pelindung keluarga, keteguhan prinsip, dan kesabaran alami.' },
  { month: 5, day: 15, horoscope: 'Taurus', colorName: 'Colonial Yellow', hex: '#F3E5AB', meaning: 'Kenyamanan kuning kolonial hangat yang melambangkan keanggunan klasik, keramahan menyambut tamu, dan stabilitas hidup.' },
  { month: 5, day: 16, horoscope: 'Taurus', colorName: 'Pale Mustard', hex: '#EEDC82', meaning: 'Kemurnian kuning gading lembut yang mencerminkan kemurnian niat, kesederhanaan bersahaja, dan kedamaian batin.' },
  { month: 5, day: 17, horoscope: 'Taurus', colorName: 'Golden Ocher', hex: '#DFB15B', meaning: 'Kehangatan kuning mentega yang memancarkan kelembutan kasih sayang, kenyamanan rumah, dan keramahan yang tulus.' },
  { month: 5, day: 18, horoscope: 'Taurus', colorName: 'Olive Brown', hex: '#6B8E23', meaning: 'Kecerahan kuning kanari ceria yang menyalakan harapan cerah, kepuasan atas karya nyata, dan rasa syukur melimpah.' },
  { month: 5, day: 19, horoscope: 'Taurus', colorName: 'Thousand Year Brown', hex: '#4B3E2A', meaning: 'Kedalaman cokelat seribu tahun yang melambangkan kebijaksanaan kuno yang berharga, ketahanan tekad, dan martabat luhur.' },
  { month: 5, day: 20, horoscope: 'Taurus', colorName: 'Deep Aqua', hex: '#008B8B', meaning: 'Kehangatan cokelat tanah subur yang mencerminkan ketulusan watak, keandalan memegang amanah, dan fondasi kokoh.' },
  { month: 5, day: 21, horoscope: 'Gemini', colorName: 'Verdigris', hex: '#43B3AE', meaning: 'Kecerahan kuning lemon ceria yang memancarkan kelincahan berpikir, rasa ingin tahu cerdas, dan antusiasme belajar.' },
  { month: 5, day: 22, horoscope: 'Gemini', colorName: 'Spruce Green', hex: '#004225', meaning: 'Kilau kuning emas muda yang menyalakan kecerdasan komunikasi, kemudahan beradaptasi, dan daya pikat sosial.' },
  { month: 5, day: 23, horoscope: 'Gemini', colorName: 'Bottle Green', hex: '#006A4E', meaning: 'Kehangatan kuning jagung manis yang melambangkan keramahan yang memikat, fleksibilitas bergaul, dan kejernihan ide.' },
  { month: 5, day: 24, horoscope: 'Gemini', colorName: 'Cypress Green', hex: '#005826', meaning: 'Keceriaan kuning dandelion yang memancarkan optimisme spontan, penyebaran inspirasi positif, dan kelincahan mental.' },
  { month: 5, day: 25, horoscope: 'Gemini', colorName: 'Naples Yellow', hex: '#FADA5E', meaning: 'Kecerahan kuning pisang cerah yang menyalakan semangat berbagi informasi, kecerdasan verbal, dan keterbukaan ide.' },
  { month: 5, day: 26, horoscope: 'Gemini', colorName: 'Marigold Yellow', hex: '#F3A505', meaning: 'Pancaran kuning mustard cerdas yang mencerminkan ketajaman logika analisis, rasa ingin tahu luas, dan keterbukaan pikiran.' },
  { month: 5, day: 27, horoscope: 'Gemini', colorName: 'Golden Yellow', hex: '#FFC000', meaning: 'Keceriaan kuning mimosa yang memancarkan keramahan hangat, kemudahan menjalin pertemanan, dan keceriaan jiwa.' },
  { month: 5, day: 28, horoscope: 'Gemini', colorName: 'Old Gold', hex: '#CFB53B', meaning: 'Kelembutan kuning jerami lembut yang melambangkan fleksibilitas berpikir, kepekaan terhadap tren baru, dan humor segar.' },
  { month: 5, day: 29, horoscope: 'Gemini', colorName: 'Coffee Brown', hex: '#4A2C2A', meaning: 'Pancaran kuning safron hangat yang memadukan imajinasi kreatif dengan kemampuan menyampaikan gagasan secara memukau.' },
  { month: 5, day: 30, horoscope: 'Gemini', colorName: 'Ash Sakura', hex: '#E8D3D1', meaning: 'Keanggunan merah koral muda yang memancarkan pesona komunikasi persuasif, diplomasi cerdas, dan daya tarik sosial.' },
  { month: 5, day: 31, horoscope: 'Gemini', colorName: 'Pale Crimson', hex: '#F8B8C6', meaning: 'Kecerdasan merah kirmizi lembut yang memadukan humor cerdas, ketangkasan intelektual, dan keramahan yang hidup.' },

  // JUNI (Gemini & Cancer) - Elemen Udara & Air (Intelektual beralih ke rasa protektif)
  { month: 6, day: 1, horoscope: 'Gemini', colorName: 'Pale Crocus', hex: '#CBA0D1', meaning: 'Keluwesan ungu crocus pastel yang melambangkan kemampuan adaptasi tinggi, fleksibilitas pikiran, dan daya tarik sosial.' },
  { month: 6, day: 2, horoscope: 'Gemini', colorName: 'Violet', hex: '#8F00FF', meaning: 'Kefasihan ungu violet cemerlang yang memancarkan kecerdasan verbal, keindahan bertutur kata, dan imajinasi artistik.' },
  { month: 6, day: 3, horoscope: 'Gemini', colorName: 'Plum', hex: '#DDA0DD', meaning: 'Dinamisme ungu plum cerah yang melambangkan interaksi sosial yang hidup, pesona magnetis, dan kelincahan berpikir.' },
  { month: 6, day: 4, horoscope: 'Gemini', colorName: 'Pale White Lily', hex: '#F6F6F6', meaning: 'Kejernihan putih bunga lili yang memancarkan objektivitas berpikir tanpa bias, keterbukaan ide, dan ketulusan niat.' },
  { month: 6, day: 5, horoscope: 'Gemini', colorName: 'Pale Fresh Green', hex: '#C2F2C2', meaning: 'Kesegaran hijau pucuk dedaunan yang melambangkan lahirnya gagasan inovatif segar, rasa ingin tahu, dan optimisme mekar.' },
  { month: 6, day: 6, horoscope: 'Gemini', colorName: 'Melon Yellow', hex: '#F8DE7E', meaning: 'Kecerahan hijau apel muda yang mencerminkan kecerdasan menangkap peluang, adaptabilitas luwes, dan keceriaan jiwa.' },
  { month: 6, day: 7, horoscope: 'Gemini', colorName: 'Elm Green', hex: '#1C542D', meaning: 'Keseimbangan hijau daun teh yang menyelaraskan ketajaman analisis logika dengan ketenangan menyampaikan pendapat.' },
  { month: 6, day: 8, horoscope: 'Gemini', colorName: 'Olive Drab', hex: '#6B8E23', meaning: 'Objektivitas hijau zaitun teduh yang melambangkan kematangan menimbang fakta, kejernihan pikiran, dan keadilan bersikap.' },
  { month: 6, day: 9, horoscope: 'Gemini', colorName: 'Cream', hex: '#FFFDD0', meaning: 'Kelembutan kuning limau lembut yang memancarkan rasa ingin tahu yang santun, keramahan mendengar, dan keterbukaan wawasan.' },
  { month: 6, day: 10, horoscope: 'Gemini', colorName: 'Lemon Yellow', hex: '#FFF44F', meaning: 'Pancaran kuning lemon murni yang menyinari logika berpikir tajam, kejernihan deduksi, dan optimisme intelektual.' },
  { month: 6, day: 11, horoscope: 'Gemini', colorName: 'Daffodil', hex: '#FFFF31', meaning: 'Pancaran kuning daffodil cerah yang melambangkan spontanitas kreatif, keceriaan berkomunikasi, dan rasa ingin tahu.' },
  { month: 6, day: 12, horoscope: 'Gemini', colorName: 'Saffron Yellow', hex: '#F4C430', meaning: 'Kehangatan kuning emas mentari yang memancarkan daya sebar inspirasi positif, keterbukaan hati, dan kecerdasan sosial.' },
  { month: 6, day: 13, horoscope: 'Gemini', colorName: 'Sunflower', hex: '#FFC512', meaning: 'Keceriaan kuning krisan yang menghidupkan suasana perbincangan, memupuk persahabatan baru, dan memperluas jaringan.' },
  { month: 6, day: 14, horoscope: 'Gemini', colorName: 'Ivory', hex: '#FFFFF0', meaning: 'Kelembutan kuning aprikot muda yang memadukan kehangatan tutur kata dengan pemikiran terbuka yang menyenangkan.' },
  { month: 6, day: 15, horoscope: 'Gemini', colorName: 'Breezy Yellow', hex: '#F1C40F', meaning: 'Kecerahan kuning berangin segar yang memancarkan pikiran cerah, kecerdasan bercerita, dan dinamisme komunikasi.' },
  { month: 6, day: 16, horoscope: 'Gemini', colorName: 'Ochre', hex: '#CC7722', meaning: 'Kemilau kuning madu lebah yang melambangkan ketekunan mengumpulkan pengetahuan, kecerdikan, dan keramahan sejati.' },
  { month: 6, day: 17, horoscope: 'Gemini', colorName: 'Old Rose', hex: '#C08081', meaning: 'Keceriaan kuning amber cerah yang memancarkan fleksibilitas menyikapi perubahan, optimisme, dan pesona humor yang segar.' },
  { month: 6, day: 18, horoscope: 'Gemini', colorName: 'Mahogany Brown', hex: '#420C09', meaning: 'Kecerahan kuning mentega hangat yang mencerminkan kemudahan bergaul, toleransi tinggi pada perbedaan, dan keterbukaan ide.' },
  { month: 6, day: 19, horoscope: 'Gemini', colorName: 'Egg Yolk', hex: '#FAD61D', meaning: 'Kekayaan kuning kuning telur yang melambangkan kelimpahan ide kreatif, imajinasi bercabang yang produktif, dan inovasi.' },
  { month: 6, day: 20, horoscope: 'Gemini', colorName: 'Sunlight Yellow', hex: '#FFEF00', meaning: 'Kelembutan kuning krem berpasir yang menjembatani rasa ingin tahu intelektual dengan kehangatan empati persahabatan.' },
  { month: 6, day: 21, horoscope: 'Cancer', colorName: 'Golden Brown', hex: '#996515', meaning: 'Keluasan biru langit musim panas yang memancarkan kedalaman intuisi batin, ketenangan pikiran, dan kepekaan rasa.' },
  { month: 6, day: 22, horoscope: 'Cancer', colorName: 'Garnet Brown', hex: '#911616', meaning: 'Keteguhan merah garnet pekat yang melambangkan ikatan batin keluarga yang kokoh, perlindungan tulus, dan kesetiaan.' },
  { month: 6, day: 23, horoscope: 'Cancer', colorName: 'Maroon', hex: '#800000', meaning: 'Kehangatan merah terakota lembut yang mencerminkan rasa aman emosional, naluri melindungi yang tulus, dan kebaikan hati.' },
  { month: 6, day: 24, horoscope: 'Cancer', colorName: 'Light Orchid Pink', hex: '#E6A8D7', meaning: 'Kenyamanan merah muda mawar lembut yang memancarkan kasih sayang merawat, kehangatan pelukan, dan ketenteraman batin.' },
  { month: 6, day: 25, horoscope: 'Cancer', colorName: 'Pale Cherry Pink', hex: '#FFC0CB', meaning: 'Kedalaman empati merah muda ceri yang melambangkan kepekaan hati membaca perasaan orang lain dan welas asih tulus.' },
  { month: 6, day: 26, horoscope: 'Cancer', colorName: 'Carnation Pink', hex: '#FFA6C9', meaning: 'Ketulusan merah muda anyelir yang memancarkan cinta kasih keibuan abadi, pengorbanan tanpa pamrih, dan kelembutan jiwa.' },
  { month: 6, day: 27, horoscope: 'Cancer', colorName: 'Rose Pink', hex: '#FF66CC', meaning: 'Keindahan merah muda teratai air yang menyimbolkan ketenteraman rumah tangga, perlindungan emosional, dan rasa syukur.' },
  { month: 6, day: 28, horoscope: 'Cancer', colorName: 'Pepper Red', hex: '#8B0000', meaning: 'Kelembutan putih mutiara berkilau yang memancarkan intuisi keibuan, kemurnian niat melindungi, dan kedamaian hati.' },
  { month: 6, day: 29, horoscope: 'Cancer', colorName: 'Baby Blue', hex: '#89CFF0', meaning: 'Kasih sayang biru muda bayi yang melambangkan insting merawat yang tulus, kepolosan budi, dan kenyamanan batin.' },
  { month: 6, day: 30, horoscope: 'Cancer', colorName: 'Pale Ultramarine', hex: '#8A9A5B', meaning: 'Kepekaan hijau laut berpasir yang mencerminkan kedalaman rasa batin, intuisi tajam yang menuntun, dan ketenteraman hidup.' },

  // JULI (Cancer & Leo) - Elemen Air & Api (Intuisi beralih ke ekspresi diri)
  { month: 7, day: 1, horoscope: 'Cancer', colorName: 'Duck Blue', hex: '#007791', meaning: 'Keteguhan biru laut bebek yang melambangkan ketenangan hati di tengah badai kehidupan, kesetiaan, dan intuisi jernih.' },
  { month: 7, day: 2, horoscope: 'Cancer', colorName: 'Cobalt Blue', hex: '#0047AB', meaning: 'Kedalaman biru kobalt yang memancarkan energi penyembuh luka batin, ketenteraman jiwa, dan perlindungan penuh kasih.' },
  { month: 7, day: 3, horoscope: 'Cancer', colorName: 'Ink Blue', hex: '#003153', meaning: 'Kekayaan biru tinta samudra yang mencerminkan kedalaman perasaan tersembunyi, penghayatan batin, dan wawasan hening.' },
  { month: 7, day: 4, horoscope: 'Cancer', colorName: 'Aqua', hex: '#00FFFF', meaning: 'Kejernihan sian akuatik yang menghadirkan kedamaian sejati di dalam rumah, kesegaran pikiran, dan kerukunan keluarga.' },
  { month: 7, day: 5, horoscope: 'Cancer', colorName: 'Pale Sax Blue', hex: '#4682B4', meaning: 'Kesetiaan biru saxon teduh yang melambangkan komitmen cinta yang kokoh, keteguhan hati, dan keandalan emosional.' },
  { month: 7, day: 6, horoscope: 'Cancer', colorName: 'Shinbashi Blue', hex: '#59B9C6', meaning: 'Ketenangan biru porselen yang memancarkan kelembutan budi, perlindungan energi positif, dan keanggunan bersikap.' },
  { month: 7, day: 7, horoscope: 'Cancer', colorName: 'Blue Canal', hex: '#006D8A', meaning: 'Kedalaman biru danau berkabut yang mencerminkan intuisi reflektif tajam, kebijaksanaan menyimak, dan ketenangan jiwa.' },
  { month: 7, day: 8, horoscope: 'Cancer', colorName: 'Marine Blue', hex: '#1E3F66', meaning: 'Rasa aman biru bahari yang melambangkan benteng perlindungan batin keluarga, ketabahan emosi, dan keteduhan relasi.' },
  { month: 7, day: 9, horoscope: 'Cancer', colorName: 'Pearl White', hex: '#EAEEE9', meaning: 'Kemurnian putih mutiara alami yang memancarkan cinta kasih murni, kebersihan niat, dan ketenteraman nurani.' },
  { month: 7, day: 10, horoscope: 'Cancer', colorName: 'Oceanic Teal', hex: '#1ABC9C', meaning: 'Kedalaman toska samudra yang memadukan kejernihan emosi dengan ketajaman intuisi yang menuntun langkah bijak.' },
  { month: 7, day: 11, horoscope: 'Cancer', colorName: 'Lavender Blue', hex: '#CCCCFF', meaning: 'Ketulusan biru lavender lembut yang melambangkan pengorbanan tanpa pamrih, kelembutan tutur kata, dan ketenangan batin.' },
  { month: 7, day: 12, horoscope: 'Cancer', colorName: 'Majolica Blue', hex: '#182C61', meaning: 'Keteduhan biru langit mendung yang mencerminkan kepekaan batin tinggi, empati mendalam, dan ketabahan emosional.' },
  { month: 7, day: 13, horoscope: 'Cancer', colorName: 'Prussian Blue', hex: '#003153', meaning: 'Keanggunan biru keabuan yang melambangkan kedewasaan menjaga rahasia, wibawa yang tenang, dan integritas tinggi.' },
  { month: 7, day: 14, horoscope: 'Cancer', colorName: 'Deep Baby Pink', hex: '#E75480', meaning: 'Kenyamanan biru safir lembut yang memancarkan kehangatan rasa aman, kestabilan emosional, dan kesetiaan sejati.' },
  { month: 7, day: 15, horoscope: 'Cancer', colorName: 'Pale Mauvette', hex: '#E0B0FF', meaning: 'Kehangatan ungu mauve lembut yang membangkitkan rasa hormat pada tradisi keluarga, kenangan indah, dan nostalgia tulus.' },
  { month: 7, day: 16, horoscope: 'Cancer', colorName: 'Fountain Blue', hex: '#5CACEE', meaning: 'Kedalaman ungu anggrek malam yang melambangkan imajinasi intuitif kaya, perlindungan spiritual, dan keteduhan batin.' },
  { month: 7, day: 17, horoscope: 'Cancer', colorName: 'Salvia Blue', hex: '#4B3621', meaning: 'Kelembutan merah muda koral pastel yang memancarkan kehangatan merangkul orang lain, empati tulus, dan keramahan budi.' },
  { month: 7, day: 18, horoscope: 'Cancer', colorName: 'Royal Purple', hex: '#7851A9', meaning: 'Kecerahan jingga persik ceria yang menyalakan harapan bahagia, keceriaan bersama orang terkasih, dan optimisme mekar.' },
  { month: 7, day: 19, horoscope: 'Cancer', colorName: 'Deep Shell Pink', hex: '#E9967A', meaning: 'Kehangatan merah muda cangkang salmon yang melambangkan pelukan penuh kasih sayang, rasa aman batin, dan kelembutan.' },
  { month: 7, day: 20, horoscope: 'Cancer', colorName: 'Wheat', hex: '#F5DEB3', meaning: 'Keberlimpahan krem gandum matang yang melambangkan ketulusan mencukupi kebutuhan sesama, kemurahan hati, dan dedikasi.' },
  { month: 7, day: 21, horoscope: 'Cancer', colorName: 'Havana Rose', hex: '#D77A7C', meaning: 'Kenyamanan emosional merah mawar havana yang menghadirkan ketenteraman hati, keharmonisan cinta, dan kedamaian rasa.' },
  { month: 7, day: 22, horoscope: 'Cancer', colorName: 'Carmine Red', hex: '#960018', meaning: 'Kesetiaan absolut merah carmine pekat yang memancarkan dedikasi cinta tanpa batas, proteksi teguh, dan ketulusan mutlak.' },
  { month: 7, day: 23, horoscope: 'Leo', colorName: 'Madder Red', hex: '#A81C07', meaning: 'Pancaran emas mentari pagi yang menandai letupan karisma kepemimpinan hangat, kemurahan hati, dan kepercayaan diri.' },
  { month: 7, day: 24, horoscope: 'Leo', colorName: 'Cupid Pink', hex: '#FFB6C1', meaning: 'Keagungan kuning emas kerajaan yang memancarkan wibawa alami, kehangatan yang mengayomi, dan semangat bersinar.' },
  { month: 7, day: 25, horoscope: 'Leo', colorName: 'Lotus Pink', hex: '#FFB6C1', meaning: 'Karisma merah muda lotus mekar yang memadukan pesona magnetis alami dengan kehangatan budi yang memikat banyak hati.' },
  { month: 7, day: 26, horoscope: 'Leo', colorName: 'Rose Madder', hex: '#E32636', meaning: 'Jiwa kepemimpinan merah madder pekat yang memancarkan keberanian menginspirasi orang lain, tekad membara, dan integritas.' },
  { month: 7, day: 27, horoscope: 'Leo', colorName: 'Crimson', hex: '#DC143C', meaning: 'Dinamisme merah jingga koral yang melambangkan antusiasme berkarya, keceriaan berekspresi, dan daya cipta tinggi.' },
  { month: 7, day: 28, horoscope: 'Leo', colorName: 'Black Persimmon', hex: '#2B2B2B', meaning: 'Keberanian merah kirmizi membara yang menegaskan optimisme menaklukkan rintangan, kemandirian, dan semangat juara.' },
  { month: 7, day: 29, horoscope: 'Leo', colorName: 'Cerulean Blue', hex: '#007BA7', meaning: 'Keluasan biru cerulean cerah yang melambangkan visi masa depan yang megah, kebanggaan diri positif, dan jiwa kepemimpinan.' },
  { month: 7, day: 30, horoscope: 'Leo', colorName: 'Peacock Blue', hex: '#33A1C9', meaning: 'Pesona biru merak berkilau yang memancarkan kebanggaan jati diri autentik, karisma memukau, dan keberanian tampil unggul.' },
  { month: 7, day: 31, horoscope: 'Leo', colorName: 'Prussian Blue', hex: '#003153', meaning: 'Kewibawaan biru prusia pekat yang melambangkan pengaruh kepemimpinan dominan, kebijaksanaan mengatur strategi, dan martabat.' },

  // AGUSTUS (Leo & Virgo) - Elemen Api & Tanah (Dari sorotan ke detail pekerjaan)
  { month: 8, day: 1, horoscope: 'Leo', colorName: 'Blue Shell', hex: '#9BB8D7', meaning: 'Pesona eksklusif biru cangkang mutiara yang memancarkan keanggunan berwibawa, karisma tenang, dan daya pikat alami.' },
  { month: 8, day: 2, horoscope: 'Leo', colorName: 'Pale Yacht Blue', hex: '#87CEEB', meaning: 'Kedermawanan biru kapal pesiar lembut yang melambangkan kemurahan hati berbagi, kelapangan dada, dan optimisme bersinar.' },
  { month: 8, day: 3, horoscope: 'Leo', colorName: 'Yacht Blue', hex: '#00BFFF', meaning: 'Ambisi besar biru kapal pesiar cerah yang memancarkan semangat menggapai puncak kejayaan dan tekad pantang menyerah.' },
  { month: 8, day: 4, horoscope: 'Leo', colorName: 'Cyan Blue', hex: '#00FFFF', meaning: 'Kreativitas biru sian cerah yang melambangkan keberanian berekspresi tanpa rasa takut dan orisinalitas karya seni.' },
  { month: 8, day: 5, horoscope: 'Leo', colorName: 'Lapis Lazuli', hex: '#26619C', meaning: 'Kemuliaan biru lapis lazuli agung yang memancarkan integritas karakter bangsawan, kejujuran luhur, dan wibawa batin.' },
  { month: 8, day: 6, horoscope: 'Leo', colorName: 'Lapis Lazuli', hex: '#26619C', meaning: 'Ketenangan biru safir malam yang menegaskan keteguhan kepemimpinan, ketenangan mengambil keputusan, dan harga diri tegak.' },
  { month: 8, day: 7, horoscope: 'Leo', colorName: 'Royal Blue', hex: '#4169E1', meaning: 'Kewibawaan biru agung royal blue yang mencerminkan kepemimpinan bijaksana, keteguhan integritas, dan martabat ningrat.' },
  { month: 8, day: 8, horoscope: 'Leo', colorName: 'Majestic Gold', hex: '#F39C12', meaning: 'Kemegahan kuning emas agung yang memancarkan kepemimpinan hangat bersinar, kemakmuran bersama, dan kemurahan hati.' },
  { month: 8, day: 9, horoscope: 'Leo', colorName: 'Navy Blue', hex: '#000080', meaning: 'Kemilau emas cemerlang yang menyalakan rasa percaya diri tinggi, antusiasme menebar inspirasi, dan keberanian memimpin.' },
  { month: 8, day: 10, horoscope: 'Leo', colorName: 'Hydrangea Blue', hex: '#8FAADC', meaning: 'Daya pikat estetis biru hortensia yang memadukan keindahan rasa seni dengan kehangatan bersosialisasi yang memukau.' },
  { month: 8, day: 11, horoscope: 'Leo', colorName: 'Mulberry', hex: '#C54B8C', meaning: 'Kelembutan biru langit lavender yang memancarkan kemuliaan budi pekerti, pesona yang santun, dan kebijaksanaan hening.' },
  { month: 8, day: 12, horoscope: 'Leo', colorName: 'Wisteria Mouse', hex: '#766980', meaning: 'Kemewahan elegan ungu wisteria teduh yang mencerminkan apresiasi pada kualitas tinggi, keanggunan sikap, dan martabat.' },
  { month: 8, day: 13, horoscope: 'Leo', colorName: 'White Blue', hex: '#AEEEEE', meaning: 'Pesona magnetis biru kosmik yang melambangkan daya tarik kepribadian kuat, kebanggaan diri sehat, dan optimisme membara.' },
  { month: 8, day: 14, horoscope: 'Leo', colorName: 'Myosotis', hex: '#5CACEE', meaning: 'Popularitas abadi biru bunga myosotis yang mencerminkan pesona yang selalu dikenang, ketulusan relasi, dan kesetiaan kawan.' },
  { month: 8, day: 15, horoscope: 'Leo', colorName: 'Yellow', hex: '#FFFF00', meaning: 'Pancaran kuning mentari penuh yang menjadi pusat energi positif, vitalitas membara, dan kebahagiaan hidup melimpah.' },
  { month: 8, day: 16, horoscope: 'Leo', colorName: 'Light Cream', hex: '#FFFDD0', meaning: 'Kehangatan kuning emas mentari yang memancarkan optimisme tak pernah padam, keterbukaan hati, dan kemurahan budi.' },
  { month: 8, day: 17, horoscope: 'Leo', colorName: 'Primrose Yellow', hex: '#F6E14F', meaning: 'Keceriaan kuning safron cerah yang menyalakan semangat kreativitas ekspresif, keberanian berpendapat, dan daya cipta.' },
  { month: 8, day: 18, horoscope: 'Leo', colorName: 'Citrus', hex: '#FFA500', meaning: 'Keberanian kuning amber menyala yang memadukan ketegasan melangkah dengan kehangatan merangkul orang lain menuju sukses.' },
  { month: 8, day: 19, horoscope: 'Leo', colorName: 'Golden Orange', hex: '#FFAE42', meaning: 'Dinamisme kuning oranye cerah yang memancarkan antusiasme memimpin, spontanitas positif, dan daya pikat sosial tinggi.' },
  { month: 8, day: 20, horoscope: 'Leo', colorName: 'Mandarin Orange', hex: '#FF8C00', meaning: 'Kehangatan oranye marigold yang melambangkan rasa bangga atas pencapaian nyata, keteguhan hati, dan optimisme mekar.' },
  { month: 8, day: 21, horoscope: 'Leo', colorName: 'Cinnamon', hex: '#D2691E', meaning: 'Pesona merah jingga api yang memancarkan gairah hidup membara, vitalitas prima, dan keberanian menghadapi persaingan.' },
  { month: 8, day: 22, horoscope: 'Leo', colorName: 'Golden Corn', hex: '#F0E68C', meaning: 'Kekuatan merah rubi cerah yang melambangkan puncak pencapaian kepemimpinan, loyalitas pada tim, dan kemuliaan karakter.' },
  { month: 8, day: 23, horoscope: 'Virgo', colorName: 'Deep Sunflower', hex: '#FFC512', meaning: 'Ketelitian hijau zaitun muda yang menandai peralihan dari sorotan panggung ke pengabdian kerja detail yang terstruktur.' },
  { month: 8, day: 24, horoscope: 'Virgo', colorName: 'Yellow Ocher', hex: '#CB9D06', meaning: 'Kesegaran hijau rumput embun yang mencerminkan komitmen menyempurnakan tugas, ketelitian analisis, dan dedikasi nyata.' },
  { month: 8, day: 25, horoscope: 'Virgo', colorName: 'Buff', hex: '#F0DC82', meaning: 'Kematangan cokelat kayu cedar yang melambangkan keandalan menuntaskan tanggung jawab, ketelitian, dan integritas kerja.' },
  { month: 8, day: 26, horoscope: 'Virgo', colorName: 'Tobacco Brown', hex: '#715E4C', meaning: 'Ketulusan cokelat tembakau teduh yang mencerminkan dedikasi tulus melayani sesama, kerendahan hati, dan ketekunan kerja.' },
  { month: 8, day: 27, horoscope: 'Virgo', colorName: 'Sky Blue', hex: '#87CEEB', meaning: 'Keseimbangan hijau lumut berpasir yang melambangkan keteraturan hidup, efisiensi kerja yang presisi, dan ketenangan rasa.' },
  { month: 8, day: 28, horoscope: 'Virgo', colorName: 'Aqua Gray', hex: '#80B3C4', meaning: 'Praktikalitas biru keabuan teduh yang menghadirkan kejernihan logika analitis, ketelitian kalkulasi, dan efisiensi kerja.' },
  { month: 8, day: 29, horoscope: 'Virgo', colorName: 'Pale Salvia Blue', hex: '#9CB2D5', meaning: 'Kekuatan penyembuh biru salvia lembut yang memancarkan kepekaan menata harmoni kesehatan fisik, pikiran, dan jiwa.' },
  { month: 8, day: 30, horoscope: 'Virgo', colorName: 'Ultramarine', hex: '#120A8F', meaning: 'Kerapian biru langit keperakan yang mencerminkan standar kualitas tinggi, kejujuran profesional, dan ketelitian metode.' },
  { month: 8, day: 31, horoscope: 'Virgo', colorName: 'Purple Navy', hex: '#4E5180', meaning: 'Ketajaman biru nila teduh yang melambangkan daya kritis konstruktif, analisis tajam menyempurnakan sistem, dan integritas.' },

  // SEPTEMBER (Virgo & Libra) - Elemen Tanah & Udara (Ketelitian berpadu harmoni estetika)
  { month: 9, day: 1, horoscope: 'Virgo', colorName: 'Fresh Green', hex: '#69B34C', meaning: 'Kesegaran hijau rumput subur yang memancarkan kesehatan prima, ketelitian menjaga kebersihan, dan keteraturan hidup.' },
  { month: 9, day: 2, horoscope: 'Virgo', colorName: 'Pasture Green', hex: '#7CFC00', meaning: 'Ketekunan hijau padang rumput yang melambangkan kerja keras di dunia nyata, dedikasi tanpa lelah, dan hasil berlimpah.' },
  { month: 9, day: 3, horoscope: 'Virgo', colorName: 'Holly Green', hex: '#005826', meaning: 'Disiplin moral hijau daun holly yang mencerminkan keteguhan integritas, prinsip etika yang lurus, dan kesetiaan janji.' },
  { month: 9, day: 4, horoscope: 'Virgo', colorName: 'Viridian', hex: '#40826D', meaning: 'Kejernihan hijau viridian teduh yang melambangkan kemampuan memecahkan masalah secara sistematis, logis, dan presisi.' },
  { month: 9, day: 5, horoscope: 'Virgo', colorName: 'Iron Blue', hex: '#1C352D', meaning: 'Keteguhan biru besi pekat yang mencerminkan kekuatan memegang prinsip, ketahanan mental, dan komitmen profesional.' },
  { month: 9, day: 6, horoscope: 'Virgo', colorName: 'Sea Pine Blue', hex: '#244F59', meaning: 'Ketahanan biru pinus samudra yang melambangkan ketajaman daya pikir, ketenangan menghadapi tekanan, dan stabilitas emosi.' },
  { month: 9, day: 7, horoscope: 'Virgo', colorName: 'Pale Water', hex: '#D4F0F0', meaning: 'Kejernihan sian air jernih yang memancarkan kejernihan intelektual, kemurnian analisis data, dan ketenangan berpikir.' },
  { month: 9, day: 8, horoscope: 'Virgo', colorName: 'Aquamarine', hex: '#7FFFD4', meaning: 'Keseimbangan biru akuatik lembut yang menghadirkan ketenangan saraf, ketelitian menata detail, dan keanggunan kerja.' },
  { month: 9, day: 9, horoscope: 'Virgo', colorName: 'Deep Teal Green', hex: '#004B49', meaning: 'Kelembutan biru langit teduh yang mencerminkan kerendahan hati, dedikasi tulus membantu orang lain, dan kebaikan budi.' },
  { month: 9, day: 10, horoscope: 'Virgo', colorName: 'Iron Navy', hex: '#252850', meaning: 'Keteraturan biru kobalt tenang yang melambangkan efisiensi kerja tinggi, loyalitas pada tugas, dan ketepatan metode.' },
  { month: 9, day: 11, horoscope: 'Virgo', colorName: 'Blue Plus', hex: '#314E6B', meaning: 'Kerapian biru laut dalam yang menegaskan dedikasi pada kesempurnaan karya, ketelitian riset, dan kejujuran ilmiah.' },
  { month: 9, day: 12, horoscope: 'Virgo', colorName: 'Earthy Clay', hex: '#D35400', meaning: 'Ketenangan biru prusia lembut yang mencerminkan pemikiran analitis tajam, kehati-hatian bersikap, dan wibawa tenang.' },
  { month: 9, day: 13, horoscope: 'Virgo', colorName: 'Purple Navy', hex: '#4E5180', meaning: 'Kematangan cokelat kenari hangat yang melambangkan kesederhanaan bersahaja, kepraktisan hidup, dan ketahanan batin.' },
  { month: 9, day: 14, horoscope: 'Virgo', colorName: 'Tan', hex: '#D2B48C', meaning: 'Kehangatan cokelat kayu manis yang memancarkan keramahan tulus, keandalan memegang rahasia, dan ketekunan melayani.' },
  { month: 9, day: 15, horoscope: 'Virgo', colorName: 'Brown', hex: '#964B00', meaning: 'Kesederhanaan cokelat bumi fungsional yang melambangkan ketulusan watak, keandalan kerja nyata, dan efisiensi bersahaja.' },
  { month: 9, day: 16, horoscope: 'Virgo', colorName: 'Terracotta', hex: '#E2725B', meaning: 'Ketahanan cokelat tanah liat yang mencerminkan kesabaran mengasah keahlian, konsistensi berkarya, dan fondasi kokoh.' },
  { month: 9, day: 17, horoscope: 'Virgo', colorName: 'Light Blue Mouse', hex: '#87CEFA', meaning: 'Ketenangan abu-abu mutiara teduh yang menghadirkan objektivitas menimbang fakta, kejernihan pikiran, dan kedamaian.' },
  { month: 9, day: 18, horoscope: 'Virgo', colorName: 'Powder Blue', hex: '#B0E0E6', meaning: 'Keanggunan abu-abu perak yang melambangkan ketelitian menyusun sistem, keadilan analitis, dan keteraturan hidup.' },
  { month: 9, day: 19, horoscope: 'Virgo', colorName: 'Lilac Haze', hex: '#C8A2C8', meaning: 'Keseriusan ungu lilac berkabut yang memancarkan ketekunan belajar, kehausan akan ilmu pengetahuan, dan kehalusan budi.' },
  { month: 9, day: 20, horoscope: 'Virgo', colorName: 'Light Lemon', hex: '#FFFACD', meaning: 'Kedalaman ungu anggrek lembut yang menyelaraskan ketelitian teknis dengan apresiasi estetika yang anggun.' },
  { month: 9, day: 21, horoscope: 'Virgo', colorName: 'Tea Green', hex: '#D0F0C0', meaning: 'Kematangan cokelat kemerahan yang melambangkan ketahanan memegang tanggung jawab, ketekunan, dan hasil kerja nyata.' },
  { month: 9, day: 22, horoscope: 'Virgo', colorName: 'Bourgeon', hex: '#8B4513', meaning: 'Keandalan cokelat tunas musim gugur yang mencerminkan sistem kerja yang presisi, kedisiplinan tinggi, dan integritas.' },
  { month: 9, day: 23, horoscope: 'Libra', colorName: 'Joan Lemonade', hex: '#FFFACD', meaning: 'Keharmonisan kuning oker lembut yang menandai transisi keindahan estetika, diplomasi adil, dan keseimbangan rasa.' },
  { month: 9, day: 24, horoscope: 'Libra', colorName: 'Green Finch', hex: '#C3D825', meaning: 'Keanggunan kuning emas musim gugur yang memancarkan pesona diplomasi santun, keadilan bersikap, dan selera seni tinggi.' },
  { month: 9, day: 25, horoscope: 'Libra', colorName: 'Sun Orange', hex: '#FF8C00', meaning: 'Keceriaan jingga aprikot hangat yang memadukan kehangatan bersosialisasi dengan pencarian keharmonisan relasi.' },
  { month: 9, day: 26, horoscope: 'Libra', colorName: 'Tangerine Orange', hex: '#FFA089', meaning: 'Pesona jingga tangerine cerah yang memancarkan apresiasi mendalam pada estetika visual, keindahan busana, dan seni.' },
  { month: 9, day: 27, horoscope: 'Libra', colorName: 'Tiger Lily', hex: '#FF6347', meaning: 'Kelembutan jingga persik manis yang menghadirkan keramahan yang memikat, diplomasi mendamaikan perselisihan, dan empati.' },
  { month: 9, day: 28, horoscope: 'Libra', colorName: 'Scarlet', hex: '#FF2400', meaning: 'Kehangatan merah terakota muda yang melambangkan keanggunan bergaul, toleransi tinggi, dan keseimbangan emosional.' },
  { month: 9, day: 29, horoscope: 'Libra', colorName: 'Opera', hex: '#FF008C', meaning: 'Kecantikan merah muda mawar lembut yang memancarkan cinta kasih yang harmonis, kehalusan tutur kata, dan daya pikat.' },
  { month: 9, day: 30, horoscope: 'Libra', colorName: 'Amaranth Purple', hex: '#AB274F', meaning: 'Kemitraan ungu amaranth pekat yang melambangkan kesetiaan dalam hubungan kerja sama, keadilan cinta, dan keselarasan rasa.' },

  // OKTOBER (Libra & Scorpio) - Elemen Udara & Air (Keseimbangan menuju misteri terdalam)
  { month: 10, day: 1, horoscope: 'Libra', colorName: 'Yellow Cinnabar', hex: '#E36C09', meaning: 'Kehangatan jingga cinnabar yang memancarkan pesona kebersamaan romantis, keharmonisan relasi, dan keramahan sosial.' },
  { month: 10, day: 2, horoscope: 'Libra', colorName: 'Bengal Red', hex: '#A84E34', meaning: 'Keanggunan merah bengal teduh yang mencerminkan sikap elegan, tata krama luhur, dan diplomasi memikat.' },
  { month: 10, day: 3, horoscope: 'Libra', colorName: 'Carrot Orange', hex: '#ED9121', meaning: 'Kehangatan jingga wortel ceria yang memancarkan keramahan terbuka, pesona bersahabat, dan optimisme bergaul.' },
  { month: 10, day: 4, horoscope: 'Libra', colorName: 'Flame Orange', hex: '#FF4500', meaning: 'Daya tarik jingga api membara yang melambangkan pesona magnetis, antusiasme merajut cinta, dan kehangatan rasa.' },
  { month: 10, day: 5, horoscope: 'Libra', colorName: 'Harmonic Pink', hex: '#FFB6C1', meaning: 'Keseimbangan merah muda harmonis yang memadukan keindahan estetika tinggi dengan kelembutan kasih sayang tulus.' },
  { month: 10, day: 6, horoscope: 'Libra', colorName: 'Cinnamon', hex: '#D2691E', meaning: 'Kelembutan merah muda koral pastel yang memancarkan kehangatan merangkul sahabat, empati tinggi, dan keteduhan budi.' },
  { month: 10, day: 7, horoscope: 'Libra', colorName: 'Cafe Au Lait', hex: '#A67B5B', meaning: 'Pesona merah mawar fajar yang melambangkan keadilan bersikap, apresiasi pada harmoni musik dan seni, serta keanggunan.' },
  { month: 10, day: 8, horoscope: 'Libra', colorName: 'Brick Red', hex: '#CB4154', meaning: 'Daya pikat merah bata lembut yang mencerminkan keseimbangan antara daya tarik intelektual dan kehangatan emosi.' },
  { month: 10, day: 9, horoscope: 'Libra', colorName: 'Terra Rosa', hex: '#C67468', meaning: 'Pesona artistik merah terra rosa yang memancarkan kreativitas estetika memukau, kepekaan seni rupa, dan wibawa anggun.' },
  { month: 10, day: 10, horoscope: 'Libra', colorName: 'Ochre', hex: '#CC7722', meaning: 'Kehangatan cokelat kemerahan lembut yang melambangkan ketulusan membina hubungan jangka panjang dan keandalan budi.' },
  { month: 10, day: 11, horoscope: 'Libra', colorName: 'Camel', hex: '#C19A6B', meaning: 'Keseimbangan cokelat tembaga hangat yang mencerminkan sikap adil menimbang pendapat, keramahan, dan pesona sosial.' },
  { month: 10, day: 12, horoscope: 'Libra', colorName: 'Burnt Sienna', hex: '#E97451', meaning: 'Keanggunan klasik cokelat sienna bakar yang memancarkan wibawa aristokrat, selera desain berkelas, dan kematangan rasa.' },
  { month: 10, day: 13, horoscope: 'Libra', colorName: 'Chestnut Brown', hex: '#5D4037', meaning: 'Kemampuan mediasi cokelat kastanye yang melambangkan kebijaksanaan mendamaikan konflik, objektivitas, dan ketenangan.' },
  { month: 10, day: 14, horoscope: 'Libra', colorName: 'Sepia', hex: '#704214', meaning: 'Kestabilan cokelat tanah liat teduh yang mencerminkan komitmen menjaga kedamaian relasi dan ketulusan hati.' },
  { month: 10, day: 15, horoscope: 'Libra', colorName: 'Red Ocher', hex: '#A95C68', meaning: 'Kebijaksanaan bergaul merah oker teduh yang memadukan keramahan sosial luas dengan wawasan psikologis mendalam.' },
  { month: 10, day: 16, horoscope: 'Libra', colorName: 'Topaz', hex: '#FFC87C', meaning: 'Kemewahan kuning topaz berkilau yang memancarkan gaya hidup elegan, selera estetika berkelas, dan rasa percaya diri.' },
  { month: 10, day: 17, horoscope: 'Libra', colorName: 'Orchid White', hex: '#FDF5E6', meaning: 'Netralitas putih anggrek krem yang melambangkan pikiran jernih tanpa prasangka, keadilan objektif, dan kedamaian hati.' },
  { month: 10, day: 18, horoscope: 'Libra', colorName: 'Pearl Gray', hex: '#C0C0C0', meaning: 'Kelembutan abu-abu awan perak yang mencerminkan kemampuan menimbang dua sisi perkara secara adil dan bijaksana.' },
  { month: 10, day: 19, horoscope: 'Libra', colorName: 'Silver Mouse', hex: '#C0C0C0', meaning: 'Ketenangan abu-abu baja lembut yang melambangkan keseimbangan logika dan rasa, ketegasan diplomatis, dan poise.' },
  { month: 10, day: 20, horoscope: 'Libra', colorName: 'Mouse Gray', hex: '#787C85', meaning: 'Keadilan hukum abu-abu tikus teduh yang mencerminkan integritas moral teguh, objektivitas hukum, dan ketenangan batin.' },
  { month: 10, day: 21, horoscope: 'Libra', colorName: 'Pigeon Purple', hex: '#877085', meaning: 'Kerapian abu-abu arang lembut yang melambangkan keanggunan bersahaja, pengendalian diri matang, dan wibawa tenang.' },
  { month: 10, day: 22, horoscope: 'Libra', colorName: 'Lithograph', hex: '#708090', meaning: 'Kepekaan hitam lembut beranggrek yang menandai peralihan ke kedalaman intuisi batin, misteri rasa, dan pesona magnetis.' },
  { month: 10, day: 23, horoscope: 'Scorpio', colorName: 'Mustard', hex: '#FFDB58', meaning: 'Ketajaman insting kuning mustar tua yang memancarkan persepsi membaca rahasia terselubung dan intuisi psikologis tajam.' },
  { month: 10, day: 24, horoscope: 'Scorpio', colorName: 'Sea Moss', hex: '#738276', meaning: 'Kekuatan regenerasi merah marun pekat yang melambangkan daya tahan batin menghadapi ujian dan keberanian bertransformasi.' },
  { month: 10, day: 25, horoscope: 'Scorpio', colorName: 'Rose Gray', hex: '#A899A6', meaning: 'Kedalaman merah anggur tua yang mencerminkan intensitas tekad, kesetiaan batin tanpa syarat, dan daya tarik misterius.' },
  { month: 10, day: 26, horoscope: 'Scorpio', colorName: 'Light Turquoise', hex: '#AFE4DE', meaning: 'Ketajaman merah darah gelap yang melambangkan fokus penyelidikan mendalam, wawasan tembus pandang, dan wibawa kokoh.' },
  { month: 10, day: 27, horoscope: 'Scorpio', colorName: 'Rusty Door', hex: '#593B32', meaning: 'Kekuatan merah garnet membara yang mencerminkan komitmen penuh gairah, daya tahan emosional luar biasa, dan keberanian.' },
  { month: 10, day: 28, horoscope: 'Scorpio', colorName: 'Pigeon Purple', hex: '#877085', meaning: 'Kedalaman merah delima pekat yang melambangkan penguasaan emosi mendalam, keberanian menyelami batin, dan proteksi diri.' },
  { month: 10, day: 29, horoscope: 'Scorpio', colorName: 'Chestnut', hex: '#954535', meaning: 'Misteri merah marun gelap yang mencerminkan tekad tak terpatahkan, regenerasi jiwa, dan ketajaman persepsi rahasia.' },
  { month: 10, day: 30, horoscope: 'Scorpio', colorName: 'Vineyard', hex: '#722F37', meaning: 'Transformasi batin merah kebun anggur tua yang melambangkan kebangkitan diri dari kesulitan dan kedalaman spiritual.' },
  { month: 10, day: 31, horoscope: 'Scorpio', colorName: 'Lilac', hex: '#C8A2C8', meaning: 'Kekuatan penyembuhan mendalam ungu lilac mistis yang memancarkan intuisi penyembuh, pembaruan energi, dan wawasan gaib.' },

  // NOVEMBER (Scorpio & Sagittarius) - Elemen Air & Api (Misteri meledak menjadi kebebasan eksplorasi)
  { month: 11, day: 1, horoscope: 'Scorpio', colorName: 'Camel', hex: '#C19A6B', meaning: 'Kemauan menembus batas cokelat unta yang melambangkan ketahanan menempuh medan sulit, tekad baja, dan kemandirian batin.' },
  { month: 11, day: 2, horoscope: 'Scorpio', colorName: 'Fawn', hex: '#E5A073', meaning: 'Ketajaman intuisi cokelat rusa muda yang memancarkan kemampuan membaca niat tersembunyi orang lain dengan presisi.' },
  { month: 11, day: 3, horoscope: 'Scorpio', colorName: 'Dark Brown', hex: '#654321', meaning: 'Ketahanan emosional cokelat tua pekat yang melambangkan benteng batin tak tergoyahkan, loyalitas sejati, dan wibawa.' },
  { month: 11, day: 4, horoscope: 'Scorpio', colorName: 'Taupe', hex: '#483C32', meaning: 'Analisis psikologis cokelat taupe teduh yang mencerminkan kemampuan membongkar lapisan misteri dan objektivitas batin.' },
  { month: 11, day: 5, horoscope: 'Scorpio', colorName: 'Charcoal Gray', hex: '#36454F', meaning: 'Penentuan sikap tegas abu-abu arang gelap yang melambangkan keberanian mengambil keputusan mutlak tanpa keraguan.' },
  { month: 11, day: 6, horoscope: 'Scorpio', colorName: 'Joan Donor Pull', hex: '#F3E5AB', meaning: 'Daya tarik magnetis krem keemasan lembut yang memancarkan pesona misterius yang memikat dan daya pikat tak terlupakan.' },
  { month: 11, day: 7, horoscope: 'Scorpio', colorName: 'Sunflower', hex: '#FFC512', meaning: 'Kekuatan tekad kuning kunyit tua yang melambangkan daya fokus luar biasa, penyelidikan mendalam, dan ketekunan rahasia.' },
  { month: 11, day: 8, horoscope: 'Scorpio', colorName: 'Nasturtium Orange', hex: '#FF7F00', meaning: 'Intensitas gairah jingga nasturtium menyala yang memancarkan vitalitas emosi mendalam, transformasi diri, dan keberanian.' },
  { month: 11, day: 9, horoscope: 'Scorpio', colorName: 'Birch', hex: '#D2B48C', meaning: 'Keberanian jingga api menyala yang mencerminkan tekad membara memperjuangkan kebenaran sejati dan loyalitas tanpa batas.' },
  { month: 11, day: 10, horoscope: 'Scorpio', colorName: 'Tobacco Brown', hex: '#715E4C', meaning: 'Kekuatan merah jingga terakota pekat yang melambangkan regenerasi batin, ketahanan mental, dan fondasi keyakinan kokoh.' },
  { month: 11, day: 11, horoscope: 'Scorpio', colorName: 'Pale Cream', hex: '#FFFDD0', meaning: 'Kedalaman merah bata gelap yang memancarkan kesetiaan mutlak, ketabahan melewati badai hidup, dan perlindungan batin.' },
  { month: 11, day: 12, horoscope: 'Scorpio', colorName: 'Sand', hex: '#C2B280', meaning: 'Kemandirian sejati cokelat pasir gurun yang mencerminkan kebebasan batin dari ketergantungan dan ketahanan watak.' },
  { month: 11, day: 13, horoscope: 'Scorpio', colorName: 'Ash Gray', hex: '#B2BEB5', meaning: 'Keteguhan cokelat tembaga tua yang melambangkan daya tahan menghadapi krisis, tekad bulat, dan perlindungan keluarga.' },
  { month: 11, day: 14, horoscope: 'Scorpio', colorName: 'Gunmetal', hex: '#2A3439', meaning: 'Kewibawaan abu-abu grafit pekat yang memancarkan penguasaan emosi tingkat tinggi, strategi tajam, dan integritas kokoh.' },
  { month: 11, day: 15, horoscope: 'Scorpio', colorName: 'Ink Black', hex: '#000000', meaning: 'Kedalaman hitam tinta pekat yang melambangkan kekuatan prinsip tak goyah, perlindungan energi batin, dan wibawa hening.' },
  { month: 11, day: 16, horoscope: 'Scorpio', colorName: 'Cherry Shell', hex: '#FBCCE7', meaning: 'Misteri hitam arang mendalam yang mencerminkan transformasi jiwa, keheningan kontemplatif, dan ketajaman persepsi batin.' },
  { month: 11, day: 17, horoscope: 'Scorpio', colorName: 'Orchid Pink', hex: '#F2BDCD', meaning: 'Pembaruan takdir merah muda anggrek yang memancarkan harapan baru bangkit dari masa lalu dan kelembutan welas asih.' },
  { month: 11, day: 18, horoscope: 'Scorpio', colorName: 'Midnight Indigo', hex: '#4B0082', meaning: 'Keanggunan merah koral pekat yang memadukan kedalaman emosi setia dengan keberanian memulai lembaran hidup baru.' },
  { month: 11, day: 19, horoscope: 'Scorpio', colorName: 'Claret', hex: '#7F1734', meaning: 'Ketahanan merah marun membara yang melambangkan daya juang batin tak kenal padam dan keberanian menyingkap kebenaran.' },
  { month: 11, day: 20, horoscope: 'Scorpio', colorName: 'Dove Gray', hex: '#6D6C6C', meaning: 'Kedalaman merah anggur tua yang mencerminkan kematangan tekad, ketajaman insting spiritual, dan kesetiaan sejati.' },
  { month: 11, day: 21, horoscope: 'Scorpio', colorName: 'Pale Sallow', hex: '#C8B560', meaning: 'Kekuatan merah garnet pekat yang menyimbolkan puncak loyalitas batin, daya magnetis kepemimpinan, dan wibawa misterius.' },
  { month: 11, day: 22, horoscope: 'Sagittarius', colorName: 'Matcha Green', hex: '#B2C248', meaning: 'Optimisme penjelajah kuning safron cerah yang menandai letupan jiwa petualang, keterbukaan pikiran, dan kebebasan.' },
  { month: 11, day: 23, horoscope: 'Sagittarius', colorName: 'Lye', hex: '#9E9764', meaning: 'Kebebasan berpikir kuning emas cerah yang memancarkan wawasan filosofis luas, antusiasme belajar, dan optimisme mekar.' },
  { month: 11, day: 24, horoscope: 'Sagittarius', colorName: 'Lead', hex: '#7C7C7C', meaning: 'Kecerahan kuning amber menyala yang melambangkan keberanian menjelajah wilayah baru, kejujuran batin, dan keceriaan jiwa.' },
  { month: 11, day: 25, horoscope: 'Sagittarius', colorName: 'Off Black', hex: '#313639', meaning: 'Kebebasan mutlak hitam lembut keabuan yang mencerminkan kemerdekaan jiwa dari batasan sempit dan visi masa depan luas.' },
  { month: 11, day: 26, horoscope: 'Sagittarius', colorName: 'Pale Apricot', hex: '#FAD6A5', meaning: 'Antusiasme aprikot pucat hangat yang memancarkan keberanian mencoba hal baru, keterbukaan budaya, dan keramahan sosial.' },
  { month: 11, day: 27, horoscope: 'Sagittarius', colorName: 'Skin Color', hex: '#FFCBA4', meaning: 'Keterbukaan kulit persik hangat yang mencerminkan penghargaan tinggi pada keberagaman manusia dan toleransi luas.' },
  { month: 11, day: 28, horoscope: 'Sagittarius', colorName: 'Suntan', hex: '#D2B48C', meaning: 'Cinta alam bebas cokelat mentari pantai yang melambangkan jiwa petualang alami, kesahajaan bersahabat, dan optimisme.' },
  { month: 11, day: 29, horoscope: 'Sagittarius', colorName: 'Brick Red', hex: '#CB4154', meaning: 'Kejujuran tanpa filter merah bata cerah yang memancarkan ketulusan berbicara apa adanya, keberanian bersikap, dan integritas.' },
  { month: 11, day: 30, horoscope: 'Sagittarius', colorName: 'Dead Leaf', hex: '#8A3324', meaning: 'Optimisme tanpa batas merah daun gugur yang melambangkan keyakinan teguh pada masa depan cerah dan kebebasan berpikir.' },

  // DESEMBER (Sagittarius & Capricorn) - Elemen Api & Tanah (Dari ekspansi kembali ke pembentukan struktur)
  { month: 12, day: 1, horoscope: 'Sagittarius', colorName: 'Flax', hex: '#EEDC82', meaning: 'Target besar kuning rami keemasan yang memancarkan cita-cita hidup tinggi, visi ekspansif, dan optimisme menembus batas.' },
  { month: 12, day: 2, horoscope: 'Sagittarius', colorName: 'Honey Suite', hex: '#D4AF37', meaning: 'Kebahagiaan dalam perjalanan kuning madu emas yang melambangkan rasa syukur menikmati proses, keramahan, dan wawasan luas.' },
  { month: 12, day: 3, horoscope: 'Sagittarius', colorName: 'Chestnut Plum', hex: '#852A2A', meaning: 'Kelapangan hati merah prem berangan yang mencerminkan sikap humoris menyikapi dinamika hidup dan kehangatan relasi.' },
  { month: 12, day: 4, horoscope: 'Sagittarius', colorName: 'Tawny Olive', hex: '#828B20', meaning: 'Kemandirian sejati hijau zaitun kecokelatan yang memadukan kebebasan berpikir petualang dengan ketahanan karakter membumi.' },
  { month: 12, day: 5, horoscope: 'Sagittarius', colorName: 'Adventurous Purple', hex: '#8E44AD', meaning: 'Eksplorasi ungu petualang cerah yang memancarkan keberanian menjelajahi gagasan baru, toleransi luas, dan imajinasi bebas.' },
  { month: 12, day: 6, horoscope: 'Sagittarius', colorName: 'Citron Gray', hex: '#A4B1A0', meaning: 'Visi internasional abu-abu sitrun teduh yang melambangkan pemikiran kosmopolitan, pemahaman budaya luas, dan objektivitas.' },
  { month: 12, day: 7, horoscope: 'Sagittarius', colorName: 'Pale Limelight', hex: '#E6FF00', meaning: 'Pembelajaran tiada henti kuning limau bercahaya yang memancarkan kehausan akan kebijaksanaan hidup dan pemikiran segar.' },
  { month: 12, day: 8, horoscope: 'Sagittarius', colorName: 'Rapeseed Oil', hex: '#A69220', meaning: 'Sikap toleran hijau minyak lobak yang mencerminkan kelapangan dada merangkul perbedaan, keterbukaan ide, dan keadilan.' },
  { month: 12, day: 9, horoscope: 'Sagittarius', colorName: 'Oil Yellow', hex: '#FADA5E', meaning: 'Keberanian berpikir kreatif kuning minyak yang memancarkan ide-ide out-of-the-box, optimisme filosofis, dan kecerdikan.' },
  { month: 12, day: 10, horoscope: 'Sagittarius', colorName: 'Bronze', hex: '#CD7F32', meaning: 'Keyakinan diri cokelat perunggu berkilau yang melambangkan keteguhan rasa percaya diri, wibawa penjelajah, dan ketangguhan.' },
  { month: 12, day: 11, horoscope: 'Sagittarius', colorName: 'Sea Shell Pink', hex: '#F0EAD6', meaning: 'Jiwa filantropi merah muda kulit kerang yang memancarkan kepedulian sosial tulus, kemurahan hati, dan cinta kemanusiaan.' },
  { month: 12, day: 12, horoscope: 'Sagittarius', colorName: 'Salmon', hex: '#FA8072', meaning: 'Inspirasi memotivasi merah salmon cerah yang melambangkan semangat membakar antusiasme orang lain dan kehangatan budi.' },
  { month: 12, day: 13, horoscope: 'Sagittarius', colorName: 'Washed Vermillion', hex: '#FF6347', meaning: 'Keberanian berpendapat merah vermilion cerah yang memancarkan ketegasan bersuara membela kebenaran dan kejujuran.' },
  { month: 12, day: 14, horoscope: 'Sagittarius', colorName: 'Vermillion', hex: '#E34234', meaning: 'Antusiasme fisik merah vermilion menyala yang memancarkan vitalitas gerak prima, semangat bertanding sehat, dan dinamisme.' },
  { month: 12, day: 15, horoscope: 'Sagittarius', colorName: 'Burnt Orange', hex: '#CC5500', meaning: 'Visi idealis oranye gosong hangat yang memadukan cita-cita luhur kemanusiaan dengan keberanian bertindak nyata.' },
  { month: 12, day: 16, horoscope: 'Sagittarius', colorName: 'Beige White', hex: '#F5F5DC', meaning: 'Eksplorasi rohani putih krem hangat yang melambangkan pencarian makna hakiki kehidupan, kemurnian niat, dan ketenangan jiwa.' },
  { month: 12, day: 17, horoscope: 'Sagittarius', colorName: 'Beige', hex: '#F5F5DC', meaning: 'Keluwesan adaptasi krem bersahaja yang mencerminkan kemudahan beradaptasi di mana pun berada dan keramahan bersahabat.' },
  { month: 12, day: 18, horoscope: 'Sagittarius', colorName: 'Brown Gold', hex: '#A57164', meaning: 'Ketangguhan penjelajah cokelat emas bumi yang melambangkan daya tahan berpetualang, ketulusan karakter, dan integritas.' },
  { month: 12, day: 19, horoscope: 'Sagittarius', colorName: 'Candy Color', hex: '#E4A010', meaning: 'Kemurahan hati kuning permen manis yang memancarkan kebahagiaan berbagi rezeki, keramahan tulus, dan keceriaan jiwa.' },
  { month: 12, day: 20, horoscope: 'Sagittarius', colorName: 'Heather', hex: '#9E7BB5', meaning: 'Rasa syukur ungu heather lembut yang melambangkan kebebasan jiwa sejati, ketenangan kontemplatif, dan apresiasi berkah hidup.' },
  { month: 12, day: 21, horoscope: 'Sagittarius', colorName: 'Lilac', hex: '#C8A2C8', meaning: 'Awal baru ungu lilac lembut yang menandai penutupan babak petualangan dengan kebijaksanaan dan kesiapan menata struktur baru.' },
  { month: 12, day: 22, horoscope: 'Capricorn', colorName: 'Heliotrope', hex: '#DF73FF', meaning: 'Fondasi tradisi ungu heliotrope cerah yang menyelaraskan wawasan masa depan dengan penghormatan mendalam pada nilai leluhur.' },
  { month: 12, day: 23, horoscope: 'Capricorn', colorName: 'Iris', hex: '#5A4FCF', meaning: 'Penghargaan pada waktu ungu iris berwibawa yang melambangkan kedisiplinan mengelola waktu, efisiensi kerja, dan integritas.' },
  { month: 12, day: 24, horoscope: 'Capricorn', colorName: 'Eggplant', hex: '#614051', meaning: 'Tanggung jawab keluarga ungu terong pekat yang mencerminkan dedikasi melindungi orang tercinta dan keteguhan komitmen.' },
  { month: 12, day: 25, horoscope: 'Capricorn', colorName: 'Eggplant Blue', hex: '#311432', meaning: 'Fokus jangka panjang ungu terong gelap yang melambangkan ketabahan membangun impian besar langkah demi langkah hingga terwujud.' },
  { month: 12, day: 26, horoscope: 'Capricorn', colorName: 'Gold', hex: '#FFD700', meaning: 'Pencapaian status tertinggi kuning emas murni yang memancarkan kesuksesan hasil kerja keras, wibawa kepemimpinan, dan martabat.' },
  { month: 12, day: 27, horoscope: 'Capricorn', colorName: 'Sallow', hex: '#C8B560', meaning: 'Kesabaran mendaki puncak kuning sallow teduh yang mencerminkan ketekunan menapaki tangga sukses dengan kehati-hatian matang.' },
  { month: 12, day: 28, horoscope: 'Capricorn', colorName: 'Joan Miel', hex: '#FFC40C', meaning: 'Keandalan watak kuning madu joan yang melambangkan kesetiaan pada prinsip moral, konsistensi kerja, dan keteguhan budi.' },
  { month: 12, day: 29, horoscope: 'Capricorn', colorName: 'Mustard', hex: '#FFDB58', meaning: 'Kekuatan disiplin kuning mustar matang yang menegaskan ketahanan mental baja, ketertiban metode, dan fokus tujuan yang jelas.' },
  { month: 12, day: 30, horoscope: 'Capricorn', colorName: 'Autumn Leaf', hex: '#C15420', meaning: 'Kematangan visi jingga daun musim gugur yang memadukan kedewasaan pengalaman hidup dengan kebijaksanaan memimpin sesama.' },
  { month: 12, day: 31, horoscope: 'Capricorn', colorName: 'Turquoise Blue', hex: '#00FFEF', meaning: 'Warisan abadi biru toska cemerlang yang menandai penutupan siklus sempurna, kejernihan visi masa depan, dan warisan luhur.' },
];
