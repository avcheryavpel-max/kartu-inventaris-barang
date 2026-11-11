import React, { useState } from 'react';
import {
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Layers,
} from 'lucide-react';
import { KIBCategory } from '../types/inventory';
import { KIB_CATEGORY_META } from '../utils/classifier';

interface TemplateMappingStepProps {
  onProceed: () => void;
}

export const TemplateMappingStep: React.FC<TemplateMappingStepProps> = ({ onProceed }) => {
  const [activeTab, setActiveTab] = useState<KIBCategory>('KIB_B');

  const sheetsInfo: Record<
    KIBCategory,
    {
      title: string;
      colsCount: number;
      columns: { num: number; name: string; mappedFrom: string; auditRule: string }[];
    }
  > = {
    KIB_A: {
      title: 'KIB A – TANAH (14 Kolom)',
      colsCount: 14,
      columns: [
        { num: 1, name: 'No', mappedFrom: 'Nomor Urut', auditRule: 'Otomatis 1..N' },
        { num: 2, name: 'Jenis Barang / Nama Barang', mappedFrom: 'Nama Barang Asli', auditRule: 'Faktual Dokumen' },
        { num: 3, name: 'Nomor Kode Barang', mappedFrom: 'Kode Barang', auditRule: 'Tanda strip (-) jika kosong' },
        { num: 4, name: 'Nomor Register', mappedFrom: 'Nomor Register', auditRule: 'Format teks (Anti notasi ilmiah)' },
        { num: 5, name: 'Luas (m2)', mappedFrom: 'Luas Tanah', auditRule: 'Dilarang mengarang jika kosong' },
        { num: 6, name: 'Tahun Pengadaan', mappedFrom: 'Tahun Pembelian', auditRule: 'Faktual Dokumen' },
        { num: 7, name: 'Letak / Alamat', mappedFrom: 'Lokasi Peletakan', auditRule: 'Faktual Dokumen' },
        { num: 8, name: 'Hak', mappedFrom: 'Status Hak Tanah', auditRule: 'Sesuai Bukti Kepemilikan' },
        { num: 9, name: 'Sertifikat Tanggal', mappedFrom: 'Tanggal Sertifikat', auditRule: 'Dilarang mengarang' },
        { num: 10, name: 'Sertifikat Nomor', mappedFrom: 'Nomor Sertifikat', auditRule: 'Dilarang mengarang' },
        { num: 11, name: 'Penggunaan', mappedFrom: 'Tujuan Penggunaan', auditRule: 'Prasarana Pendidikan' },
        { num: 12, name: 'Asal-usul', mappedFrom: 'Sumber Dana', auditRule: 'BOS / Yayasan / Kegiatan' },
        { num: 13, name: 'Harga (Rp.)', mappedFrom: 'Harga Perolehan', auditRule: 'Kuitansi sah / strip (-)' },
        { num: 14, name: 'Keterangan', mappedFrom: 'Jejak Dokumen PDF', auditRule: 'Nomor Halaman & Catatan' },
      ],
    },
    KIB_B: {
      title: 'KIB B – PERALATAN DAN MESIN (16 Kolom)',
      colsCount: 16,
      columns: [
        { num: 1, name: 'No', mappedFrom: 'Nomor Urut', auditRule: 'Otomatis 1..N' },
        { num: 2, name: 'Kode Barang', mappedFrom: 'Kode Klasifikasi Aset', auditRule: 'Sesuai Permendagri 108/2016' },
        { num: 3, name: 'Jenis Barang / Nama Barang', mappedFrom: 'Nama Barang di PDF', auditRule: 'Nama Faktual' },
        { num: 4, name: 'Nomor Register', mappedFrom: 'Register Aset', auditRule: 'Format Teks (0001, 0002..)' },
        { num: 5, name: 'Merk / Type', mappedFrom: 'Merk / Seri (ASUS, Epson, KDK..)', auditRule: 'Diekstrak dari teks & foto' },
        { num: 6, name: 'Ukuran / CC', mappedFrom: 'Spesifikasi Ukuran', auditRule: '15m, 2PK, 1200VA, dll' },
        { num: 7, name: 'Bahan', mappedFrom: 'Material Barang', auditRule: 'Besi, Kayu, Kulit, Plastik' },
        { num: 8, name: 'Tahun Pembelian', mappedFrom: 'Tahun pada Tanggal', auditRule: '2024, 2025, 2026' },
        { num: 9, name: 'Nomor: Pabrik', mappedFrom: 'Serial Number Pabrik', auditRule: 'Dilarang mengarang jika kosong' },
        { num: 10, name: 'Nomor: Rangka', mappedFrom: 'No Rangka (Kendaraan)', auditRule: 'Strip (-) jika bukan kendaraan' },
        { num: 11, name: 'Nomor: Mesin', mappedFrom: 'No Mesin (Kendaraan)', auditRule: 'Strip (-) jika bukan kendaraan' },
        { num: 12, name: 'Nomor: Polisi', mappedFrom: 'Plat Nomor', auditRule: 'Strip (-) jika bukan kendaraan' },
        { num: 13, name: 'Nomor: BPKB', mappedFrom: 'Nomor BPKB', auditRule: 'Strip (-) jika bukan kendaraan' },
        { num: 14, name: 'Asal-usul Cara Perolehan', mappedFrom: 'Sumber Dana & Kuantitas', auditRule: 'Dana BOS / Yayasan / Kegiatan' },
        { num: 15, name: 'Harga (Rp.)', mappedFrom: 'Harga Perolehan', auditRule: 'Formula =SUM(...) di baris total' },
        { num: 16, name: 'Keterangan', mappedFrom: 'Jejak Halaman PDF & Kondisi', auditRule: 'Hal PDF + Ruang + Status RB' },
      ],
    },
    KIB_C: {
      title: 'KIB C – BANGUNAN DAN GEDUNG (17 Kolom)',
      colsCount: 17,
      columns: [
        { num: 1, name: 'No', mappedFrom: 'Nomor Urut', auditRule: 'Otomatis' },
        { num: 2, name: 'Jenis Barang / Nama Barang', mappedFrom: 'Nama Bangunan / Kanopi', auditRule: 'Faktual' },
        { num: 3, name: 'Nomor: Kode Barang', mappedFrom: 'Kode Barang', auditRule: 'Standar BMD' },
        { num: 4, name: 'Nomor: Register', mappedFrom: 'Register', auditRule: 'Format teks' },
        { num: 5, name: 'Kondisi Bangunan (B, KB, RB)', mappedFrom: 'Kondisi Fisik', auditRule: 'Baik / Rusak' },
        { num: 6, name: 'Konstruksi: Bertingkat / Tidak', mappedFrom: 'Tingkat Bangunan', auditRule: 'Tidak Bertingkat' },
        { num: 7, name: 'Konstruksi: Beton / Tidak', mappedFrom: 'Bahan Konstruksi', auditRule: 'Baja Ringan / Beton' },
        { num: 8, name: 'Luas Lantai (m2)', mappedFrom: 'Luas Kanopi/Ruang (30 m2)', auditRule: 'Sesuai catatan dokumen' },
        { num: 9, name: 'Letak / Alamat', mappedFrom: 'Lokasi (Lapangan/Toilet)', auditRule: 'Faktual Dokumen' },
        { num: 10, name: 'Dokumen Gedung: Tanggal', mappedFrom: 'Tanggal Pengadaan', auditRule: 'Faktual' },
        { num: 11, name: 'Dokumen Gedung: Nomor', mappedFrom: 'Nomor IMB / Kontrak', auditRule: 'Strip (-) jika belum ada' },
        { num: 12, name: 'Luas Tanah (m2)', mappedFrom: 'Luas Tapak', auditRule: 'Dilarang mengarang' },
        { num: 13, name: 'Status Tanah', mappedFrom: 'Status Kepemilikan', auditRule: 'Milik Yayasan' },
        { num: 14, name: 'Nomor Kode Tanah', mappedFrom: 'Kode KIB A', auditRule: 'Strip (-)' },
        { num: 15, name: 'Asal-usul Tanah', mappedFrom: 'Sumber Dana', auditRule: 'BOSP / Yayasan' },
        { num: 16, name: 'Harga (Rp.)', mappedFrom: 'Nilai Bangunan', auditRule: 'Sesuai Kuitansi / Kontrak' },
        { num: 17, name: 'Keterangan', mappedFrom: 'Jejak PDF', auditRule: 'Nomor Halaman Sumber' },
      ],
    },
    KIB_D: {
      title: 'KIB D – JALAN, IRIGASI, DAN JARINGAN (17 Kolom)',
      colsCount: 17,
      columns: [
        { num: 1, name: 'No', mappedFrom: 'Nomor Urut', auditRule: 'Otomatis' },
        { num: 2, name: 'Jenis Barang / Nama Barang', mappedFrom: 'Meteran PDAM / Jaringan Air', auditRule: 'Faktual Dokumen' },
        { num: 3, name: 'Nomor: Kode Barang', mappedFrom: 'Kode Jaringan', auditRule: 'Standar BMD' },
        { num: 4, name: 'Nomor: Register', mappedFrom: 'Register', auditRule: 'Format teks' },
        { num: 5, name: 'Konstruksi', mappedFrom: 'Material Pipa / Kabel', auditRule: 'Pipa PVC / Jaringan Air' },
        { num: 6, name: 'Panjang (Km)', mappedFrom: 'Panjang Jaringan', auditRule: 'Strip (-) jika titik sambungan' },
        { num: 7, name: 'Lebar (m)', mappedFrom: 'Dimensi Jaringan', auditRule: 'Strip (-)' },
        { num: 8, name: 'Luas (m2)', mappedFrom: 'Area Jaringan', auditRule: 'Strip (-)' },
        { num: 9, name: 'Letak / Lokasi', mappedFrom: 'Lokasi (Parkiran Siswa/Torren)', auditRule: 'Faktual Dokumen' },
        { num: 10, name: 'Dokumen: Tanggal', mappedFrom: 'Tanggal Pemasangan', auditRule: 'Faktual Dokumen' },
        { num: 11, name: 'Dokumen: Nomor', mappedFrom: 'Nomor Berita Acara', auditRule: 'Strip (-)' },
        { num: 12, name: 'Status Tanah', mappedFrom: 'Status Lahan', auditRule: 'Milik Yayasan' },
        { num: 13, name: 'Nomor Kode Tanah', mappedFrom: 'Kode Tanah', auditRule: 'Strip (-)' },
        { num: 14, name: 'Asal-usul Tanah', mappedFrom: 'Sumber Dana', auditRule: 'Yayasan / Kegiatan' },
        { num: 15, name: 'Harga (Rp.)', mappedFrom: 'Biaya Pemasangan', auditRule: 'Sesuai Dokumen' },
        { num: 16, name: 'Kondisi (B, KB, RB)', mappedFrom: 'Kondisi Fisik', auditRule: 'Baik (B)' },
        { num: 17, name: 'Keterangan', mappedFrom: 'Jejak PDF', auditRule: 'Hal. 11 Buku Manual' },
      ],
    },
    KIB_E: {
      title: 'KIB E – ASET TETAP LAINNYA (16 Kolom)',
      colsCount: 16,
      columns: [
        { num: 1, name: 'No', mappedFrom: 'Nomor Urut', auditRule: 'Otomatis' },
        { num: 2, name: 'Jenis Barang / Nama Barang', mappedFrom: 'Nama Buku Paket / Alat Musik', auditRule: 'Faktual' },
        { num: 3, name: 'Nomor: Kode Barang', mappedFrom: 'Kode Barang KIB E', auditRule: 'Standar BMD' },
        { num: 4, name: 'Nomor: Register', mappedFrom: 'Register', auditRule: 'Format teks' },
        { num: 5, name: 'Buku/Perpustakaan: Judul/Pencipta', mappedFrom: 'Judul Buku & Penerbit Erlangga', auditRule: 'Faktual dari Sampul' },
        { num: 6, name: 'Buku/Perpustakaan: Spesifikasi', mappedFrom: 'Kurikulum / Jenjang SMA', auditRule: 'Faktual' },
        { num: 7, name: 'Kesenian: Asal Daerah', mappedFrom: 'Asal Instrumen Seni', auditRule: 'Strip (-)' },
        { num: 8, name: 'Kesenian: Pencipta', mappedFrom: 'Pembuat / Merk Musik', auditRule: 'Yamaha / Tornado' },
        { num: 9, name: 'Kesenian: Bahan', mappedFrom: 'Material Alat Musik', auditRule: 'Kayu / Logam' },
        { num: 10, name: 'Hewan/Tumbuhan: Tanggal', mappedFrom: 'Tanggal', auditRule: 'Strip (-)' },
        { num: 11, name: 'Hewan/Tumbuhan: Nomor', mappedFrom: 'Nomor Registrasi', auditRule: 'Strip (-)' },
        { num: 12, name: 'Jumlah', mappedFrom: 'Kuantitas (72, 80, 144, 160 eks)', auditRule: 'Faktual Dokumen' },
        { num: 13, name: 'Tahun Cetak / Pembelian', mappedFrom: 'Tahun Pengadaan', auditRule: '2024, 2025, 2026' },
        { num: 14, name: 'Asal-usul Cara Perolehan', mappedFrom: 'Sumber Dana (Dana BOS/BOSP)', auditRule: 'Faktual' },
        { num: 15, name: 'Harga (Rp.)', mappedFrom: 'Harga Perolehan', auditRule: 'Kuitansi / Strip' },
        { num: 16, name: 'Keterangan', mappedFrom: 'Jejak Halaman PDF & Lokasi', auditRule: 'Perpustakaan / Siswa' },
      ],
    },
    KIB_F: {
      title: 'KIB F – KONSTRUKSI DALAM PENGERJAAN (15 Kolom)',
      colsCount: 15,
      columns: [
        { num: 1, name: 'No', mappedFrom: 'Nomor Urut', auditRule: 'Otomatis' },
        { num: 2, name: 'Jenis Barang / Nama Barang', mappedFrom: 'Proyek Kanopi Halaman', auditRule: 'Faktual Dokumen' },
        { num: 3, name: 'Bangunan (P, SP, D)', mappedFrom: 'Tingkat Permanen', auditRule: 'SP (Semi Permanen)' },
        { num: 4, name: 'Konstruksi: Bertingkat', mappedFrom: 'Bertingkat / Tidak', auditRule: 'Tidak Bertingkat' },
        { num: 5, name: 'Konstruksi: Beton / Tidak', mappedFrom: 'Beton / Baja', auditRule: 'Baja Ringan' },
        { num: 6, name: 'Luas (m2)', mappedFrom: 'Luas Kanopi (30 m2)', auditRule: 'Faktual' },
        { num: 7, name: 'Letak / Lokasi Alamat', mappedFrom: 'Halaman Sekolah Depan Kantor', auditRule: 'Faktual' },
        { num: 8, name: 'Dokumen: Tanggal', mappedFrom: 'Tanggal SPK / Catatan', auditRule: 'Desember 2024' },
        { num: 9, name: 'Dokumen: Nomor', mappedFrom: 'Nomor Kontrak', auditRule: 'Strip (-)' },
        { num: 10, name: 'Tgl, bulan, tahun mulai', mappedFrom: 'Bulan Pengerjaan', auditRule: 'Desember 2024' },
        { num: 11, name: 'Status Tanah', mappedFrom: 'Status Tanah', auditRule: 'Milik Yayasan' },
        { num: 12, name: 'Nomor Kode Tanah', mappedFrom: 'Kode Tanah', auditRule: 'Strip (-)' },
        { num: 13, name: 'Asal-usul Pembiayaan', mappedFrom: 'Sumber Dana (Dana BOSP)', auditRule: 'Faktual' },
        { num: 14, name: 'Nilai Kontrak (ribuan Rp)', mappedFrom: 'Nilai Kontrak', auditRule: 'Formula =SUM(...)' },
        { num: 15, name: 'Keterangan', mappedFrom: 'Jejak Dokumen PDF', auditRule: 'Hal. 24 Buku Manual' },
      ],
    },
    NON_KAPITALISASI: {
      title: 'BELANJA NON-KAPITALISASI (< Rp. 300.000) (16 Kolom)',
      colsCount: 16,
      columns: [
        { num: 1, name: 'No', mappedFrom: 'Nomor Urut', auditRule: 'Otomatis' },
        { num: 2, name: 'Kode Barang', mappedFrom: 'Kode Barang Habis Pakai', auditRule: 'Standar BMD' },
        { num: 3, name: 'Jenis Barang / Nama Barang', mappedFrom: 'Sapu, Pel, Ember, Sunlight, dll', auditRule: 'Faktual' },
        { num: 4, name: 'Nomor Register', mappedFrom: 'Register', auditRule: 'Format teks' },
        { num: 5, name: 'Merk / Type', mappedFrom: 'Merk (Sunlight, So Klin, Vixal..)', auditRule: 'Faktual' },
        { num: 6, name: 'Ukuran / CC', mappedFrom: 'Spesifikasi Unit', auditRule: 'Faktual' },
        { num: 7, name: 'Bahan', mappedFrom: 'Material', auditRule: 'Ijuk, Plastik, Kain' },
        { num: 8, name: 'Tahun Pembelian', mappedFrom: 'Tahun', auditRule: 'Faktual' },
        { num: 9, name: 'Nomor: Pabrik..BPKB', mappedFrom: 'Nomor Spesifik', auditRule: 'Strip (-)' },
        { num: 14, name: 'Asal-usul Cara Perolehan', mappedFrom: 'Sumber Dana & Kuantitas', auditRule: 'Faktual' },
        { num: 15, name: 'Harga (Rp.)', mappedFrom: 'Harga', auditRule: 'Dilarang mengarang' },
        { num: 16, name: 'Keterangan', mappedFrom: 'Jejak Halaman PDF & Lokasi', auditRule: 'Faktual' },
      ],
    },
  };

  const currentSheet = sheetsInfo[activeTab];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          <span>Tahap 4: Format Template Resmi Sesuai Format_KIB_69eefa18.pdf</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Penetapan Struktur Lembar &amp; Pemetaan Kolom Template
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Setiap sheet KIB memiliki struktur kolom, lebar, dan format sel yang disesuaikan secara presisi dengan
          dokumen template KIB pemerintah. Tidak ada kolom terpotong dan tidak ada data yang tertimpa.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {(Object.keys(sheetsInfo) as KIBCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === cat
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {KIB_CATEGORY_META[cat].short}
          </button>
        ))}
      </div>

      {/* Sheet Detail Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-400" />
            <span className="font-extrabold text-sm">{currentSheet.title}</span>
          </div>
          <div className="flex items-center space-x-3 text-xs text-slate-300">
            <span>Standar Permendagri No. 19/2016</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-semibold">Formula =SUM() Aktif</span>
          </div>
        </div>

        <div className="p-4 border-b border-slate-100 bg-amber-50/40 text-xs text-amber-900 flex items-center space-x-2">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Nomor register diformat sebagai teks (<span className="font-mono text-slate-900 font-bold">'0001</span>)
            sehingga Microsoft Excel tidak mengubahnya menjadi notasi ilmiah.
          </span>
        </div>

        <div className="overflow-x-auto max-h-[460px]">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold sticky top-0 border-b border-slate-200 z-10">
              <tr>
                <th className="py-2.5 px-3 w-16 text-center">Kolom</th>
                <th className="py-2.5 px-4">Nama Kolom Resmi di Template</th>
                <th className="py-2.5 px-4">Sumber Data dari Dokumen PDF</th>
                <th className="py-2.5 px-4">Ketentuan Kepatuhan Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentSheet.columns.map((c) => (
                <tr key={c.num} className="hover:bg-slate-50/70 transition">
                  <td className="py-2.5 px-3 text-center font-bold text-slate-900 font-mono">
                    [{c.num}]
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-slate-900">{c.name}</td>
                  <td className="py-2.5 px-4 text-blue-700 font-medium">{c.mappedFrom}</td>
                  <td className="py-2.5 px-4 text-slate-500">
                    <span className="inline-flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{c.auditRule}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex justify-between items-center pt-2">
        <div className="text-xs text-slate-500 flex items-center space-x-1.5">
          <Layers className="w-4 h-4 text-slate-400" />
          <span>7 Sheet Template KIB resmi siap digunakan untuk output Excel.</span>
        </div>
        <button
          onClick={onProceed}
          className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-3 hover:translate-x-0.5"
        >
          <span>Jalankan Validasi Audit 12-Aturan (Tahap 5)</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
