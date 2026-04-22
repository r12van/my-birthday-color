import { birthdayColors } from '@/lib/colorData';
import { Metadata } from 'next';
import ColorDetailClient from '@/components/ColorDetailClient';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ month: string, day: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const data = birthdayColors.find(c => c.month === parseInt(resolvedParams.month) && c.day === parseInt(resolvedParams.day));
  
  const title = `Warna Lahir ${resolvedParams.day} ${monthNames[parseInt(resolvedParams.month) - 1]}`;
  const description = data 
    ? `Temukan makna warna ${data.colorName} untuk kelahiran ${resolvedParams.day} ${monthNames[parseInt(resolvedParams.month) - 1]}. Lengkap dengan zodiak dan palet warna.`
    : `Cek warna keberuntungan berdasarkan tanggal lahirmu.`;

  return { title, description };
}

export default async function DetailPage({ 
  params 
}: { 
  params: Promise<{ month: string, day: string }> 
}) {
  const resolvedParams = await params;
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const data = birthdayColors.find(c => c.month === parseInt(resolvedParams.month) && c.day === parseInt(resolvedParams.day));

  if (!data) return <div className="p-10 text-center">Data tidak ditemukan.</div>;

  // Memanggil komponen interaktif dan mengirimkan data kepadanya
  return <ColorDetailClient data={data} monthNames={monthNames} />;
}

export async function generateStaticParams() {
  return birthdayColors.map((color) => ({
    month: color.month.toString(),
    day: color.day.toString(),
  }));
}