import React, { useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  FileCheck2,
  CheckCircle2,
  Printer,
  Sparkles,
  School,
  ExternalLink,
  Table,
} from 'lucide-react';
import { InventoryItem, ValidationSummary, KIBCategory } from '../types/inventory';
import {
  InstitutionInfo,
  generateMasterKIBWorkbook,
  generateValidationReportWorkbook,
  generateVerificationListWorkbook,
  generateAuditTrailWorkbook,
} from '../utils/excelExporter';
import { KIB_CATEGORY_META } from '../utils/classifier';

interface ExportStepProps {
  items: InventoryItem[];
  summary: ValidationSummary;
  institution: InstitutionInfo;
  onUpdateInstitution: (info: InstitutionInfo) => void;
}

export const ExportStep: React.FC<ExportStepProps> = ({
  items,
  summary,
  institution,
  onUpdateInstitution,
}) => {
  const [isExportingMaster, setIsExportingMaster] = useState(false);
  const [isExportingVal, setIsExportingVal] = useState(false);
  const [isExportingVerif, setIsExportingVerif] = useState(false);
  const [isExportingAudit, setIsExportingAudit] = useState(false);

  const [previewSheet, setPreviewSheet] = useState<KIBCategory | 'REKAP'>('REKAP');

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadMaster = async () => {
    setIsExportingMaster(true);
    try {
      const blob = await generateMasterKIBWorkbook(items, institution);
      downloadBlob(blob, `KIB_LENGKAP_${institution.schoolName.replace(/\s+/g, '_')}_2026.xlsx`);
    } catch (e) {
      console.error('Error exporting KIB master:', e);
    } finally {
      setIsExportingMaster(false);
    }
  };

  const handleDownloadVal = async () => {
    setIsExportingVal(true);
    try {
      const blob = await generateValidationReportWorkbook(summary);
      downloadBlob(blob, `LAPORAN_VALIDASI_AUDIT_KIB_${institution.schoolName.replace(/\s+/g, '_')}.xlsx`);
    } catch (e) {
      console.error('Error exporting validation:', e);
    } finally {
      setIsExportingVal(false);
    }
  };

  const handleDownloadVerif = async () => {
    setIsExportingVerif(true);
    try {
      const blob = await generateVerificationListWorkbook(items);
      downloadBlob(blob, `DAFTAR_BARANG_PERLU_VERIFIKASI_${institution.schoolName.replace(/\s+/g, '_')}.xlsx`);
    } catch (e) {
      console.error('Error exporting verif list:', e);
    } finally {
      setIsExportingVerif(false);
    }
  };

  const handleDownloadAudit = async () => {
    setIsExportingAudit(true);
    try {
      const blob = await generateAuditTrailWorkbook(items);
      downloadBlob(blob, `MATRIKS_AUDIT_TRAIL_PDF_KE_KIB_${institution.schoolName.replace(/\s+/g, '_')}.xlsx`);
    } catch (e) {
      console.error('Error exporting audit trail:', e);
    } finally {
      setIsExportingAudit(false);
    }
  };

  const previewItems =
    previewSheet === 'REKAP' ? items : items.filter((i) => i.category === previewSheet);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tahap 7: Dokumen Final Siap Diunduh</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Ekspor Kartu Inventaris Barang (KIB) &amp; Berkas Audit
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          File Excel (.xlsx) dibuat lengkap dengan 8 sheet terpisah, formula subtotal otomatis, format nomor register
          bebas notasi ilmiah, dan identitas penandatanganan resmi.
        </p>
      </div>

      {/* Primary Hero Download Card */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 rounded-3xl shadow-xl border border-blue-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Format Standar Permendagri No. 19/2016 &amp; Format_KIB_69eefa18</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Unduh Buku KIB Lengkap (.XLSX)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Memuat seluruh lembar <span className="font-semibold text-white">KIB A (Tanah)</span>,{' '}
              <span className="font-semibold text-white">KIB B (Peralatan &amp; Mesin)</span>,{' '}
              <span className="font-semibold text-white">KIB C (Bangunan)</span>,{' '}
              <span className="font-semibold text-white">KIB D (Jaringan)</span>,{' '}
              <span className="font-semibold text-white">KIB E (Aset Lainnya/Buku)</span>,{' '}
              <span className="font-semibold text-white">KIB F (KDP)</span>, dan{' '}
              <span className="font-semibold text-white">Non-Kapitalisasi</span>.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{items.length} Barang Terpetakan</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>8 Sheet Excel Terstruktur</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Formula SUM &amp; Kolom Proporsional</span>
              </span>
            </div>
          </div>

          <button
            onClick={handleDownloadMaster}
            disabled={isExportingMaster}
            className="w-full lg:w-auto px-8 py-4.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wider uppercase shadow-xl hover:shadow-amber-500/25 transition-all duration-200 flex items-center justify-center space-x-3 shrink-0 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-5 h-5 text-slate-950 font-bold" />
            <span>
              {isExportingMaster ? 'Sedang Membuat Excel...' : 'DOWNLOAD HASIL KIB (.XLSX)'}
            </span>
          </button>
        </div>
      </div>

      {/* 3 Secondary Download Buttons (Per Specification) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sub-download 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-400 transition">
          <div>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3 font-bold">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Laporan Validasi &amp; Integritas Data
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Rekapitulasi 12-aturan audit, temuan ketidaklengkapan, dan skor kesiapan administrasi.
            </p>
          </div>
          <button
            onClick={handleDownloadVal}
            disabled={isExportingVal}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-blue-50 text-blue-900 font-bold text-xs border border-slate-200 hover:border-blue-300 transition flex items-center justify-center space-x-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Laporan Validasi (.xlsx)</span>
          </button>
        </div>

        {/* Sub-download 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-amber-400 transition">
          <div>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 font-bold">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Daftar Barang Perlu Verifikasi
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Daftar aset dengan kolom harga belum tercatat di dokumen atau berstatus rusak berat / musnah.
            </p>
          </div>
          <button
            onClick={handleDownloadVerif}
            disabled={isExportingVerif}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-amber-50 text-amber-900 font-bold text-xs border border-slate-200 hover:border-amber-300 transition flex items-center justify-center space-x-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Daftar Verifikasi (.xlsx)</span>
          </button>
        </div>

        {/* Sub-download 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-400 transition">
          <div>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3 font-bold">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Matriks Audit Trail PDF ke KIB
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Jejak penelusuran lengkap nomor halaman PDF, teks asli, dasar pertimbangan klasifikasi.
            </p>
          </div>
          <button
            onClick={handleDownloadAudit}
            disabled={isExportingAudit}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-purple-50 text-purple-900 font-bold text-xs border border-slate-200 hover:border-purple-300 transition flex items-center justify-center space-x-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Matriks Audit Trail (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Institution Signature Settings */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <School className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Identitas Dokumen &amp; Penandatanganan KIB
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Dicantumkan pada bagian bawah setiap lembar KIB
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Nama Satuan Pendidikan</label>
            <input
              type="text"
              value={institution.schoolName}
              onChange={(e) => onUpdateInstitution({ ...institution, schoolName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Kepala SKPD / Sekolah</label>
            <input
              type="text"
              value={institution.headmasterName}
              onChange={(e) => onUpdateInstitution({ ...institution, headmasterName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Pengurus Barang / Waka Sarpras</label>
            <input
              type="text"
              value={institution.officerName}
              onChange={(e) => onUpdateInstitution({ ...institution, officerName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">NIP Kepala Sekolah</label>
            <input
              type="text"
              value={institution.headmasterNip}
              onChange={(e) => onUpdateInstitution({ ...institution, headmasterNip: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">NIP Pengurus Barang</label>
            <input
              type="text"
              value={institution.officerNip}
              onChange={(e) => onUpdateInstitution({ ...institution, officerNip: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Kota &amp; Tanggal Pembuatan</label>
            <input
              type="text"
              value={institution.cityDate}
              onChange={(e) => onUpdateInstitution({ ...institution, cityDate: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Live Excel Sheet Inspector (Preview before downloading) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center space-x-2">
            <Table className="w-4 h-4 text-slate-600" />
            <span className="text-xs font-bold text-slate-900">
              Pratinjau Struktur Isi Lembar Excel Sebelum Diunduh:
            </span>
          </div>

          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
            {(['REKAP', 'KIB_B', 'KIB_E', 'KIB_C', 'KIB_D', 'NON_KAPITALISASI'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setPreviewSheet(tab)}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                  previewSheet === tab
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab === 'REKAP' ? 'Rekapitulasi' : KIB_CATEGORY_META[tab].short}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 overflow-x-auto max-h-[360px]">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">No</th>
                <th className="py-2.5 px-3 w-20">Hal PDF</th>
                <th className="py-2.5 px-4">Nama Barang</th>
                <th className="py-2.5 px-3">Kategori KIB</th>
                <th className="py-2.5 px-3">Jumlah</th>
                <th className="py-2.5 px-3">Tahun</th>
                <th className="py-2.5 px-3">Sumber Dana</th>
                <th className="py-2.5 px-4">Lokasi Fisik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {previewItems.slice(0, 15).map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-2 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-2 px-3 font-semibold text-blue-700">Hal. {item.pageNumber}</td>
                  <td className="py-2 px-4 font-bold text-slate-900">{item.standardName}</td>
                  <td className="py-2 px-3">
                    <span className="text-[11px] font-semibold text-slate-700">
                      {KIB_CATEGORY_META[item.category].short}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-medium text-slate-800">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="py-2 px-3 text-slate-600">{item.purchaseYear || '-'}</td>
                  <td className="py-2 px-3 text-slate-600">{item.fundingSource}</td>
                  <td className="py-2 px-4 text-slate-600 truncate max-w-xs">{item.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {previewItems.length > 15 && (
            <div className="text-center py-2 text-[11px] text-slate-400">
              ... dan {previewItems.length - 15} baris lainnya akan termuat lengkap di file Excel
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
