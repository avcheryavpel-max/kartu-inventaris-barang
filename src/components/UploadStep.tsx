import React, { useRef } from 'react';
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { OFFICIAL_DOCUMENT_NAME, OFFICIAL_TEMPLATE_NAME, TOTAL_OFFICIAL_PAGES } from '../data/defaultInventory';

interface UploadStepProps {
  inventoryFileName: string;
  templateFileName: string;
  totalPages: number;
  isUsingSample: boolean;
  onLoadOfficialSample: () => void;
  onCustomInventoryUpload: (file: File) => void;
  onCustomTemplateUpload: (file: File) => void;
  onProceed: () => void;
}

export const UploadStep: React.FC<UploadStepProps> = ({
  inventoryFileName,
  templateFileName,
  totalPages,
  isUsingSample,
  onLoadOfficialSample,
  onCustomInventoryUpload,
  onCustomTemplateUpload,
  onProceed,
}) => {
  const invInputRef = useRef<HTMLInputElement>(null);
  const tplInputRef = useRef<HTMLInputElement>(null);

  const handleInvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onCustomInventoryUpload(e.target.files[0]);
    }
  };

  const handleTplChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onCustomTemplateUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Tahap 1: Persiapan &amp; Unggah Dokumen Inventaris</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Unggah Dokumen Inventaris &amp; Format Template KIB
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Sistem membaca buku register inventaris hasil pemindaian (scanned PDF) maupun teks,
          kemudian memetakan seluruh aset ke format Kartu Inventaris Barang (KIB A–F) secara faktual.
        </p>
      </div>

      {/* Quick Action: Load Attached Real Documents */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 p-6 rounded-2xl shadow-xl border border-blue-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Dokumen Resmi SMAS Tunas Baru Jin Seung Batam Tersedia</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Gunakan Dokumen Asli Terlampir (53 Halaman PDF &amp; Format KIB)
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Memuat langsung file <span className="font-mono text-amber-300">{OFFICIAL_DOCUMENT_NAME}</span> (buku inventaris manual berfoto 53 halaman) beserta template resmi <span className="font-mono text-amber-300">{OFFICIAL_TEMPLATE_NAME}</span>.
            </p>
          </div>

          <button
            onClick={onLoadOfficialSample}
            className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center space-x-2 shrink-0 shadow-lg ${
              isUsingSample
                ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/20 ring-2 ring-emerald-400'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 hover:scale-[1.02]'
            }`}
          >
            {isUsingSample ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>Dokumen Resmi Aktif ({TOTAL_OFFICIAL_PAGES} Hal)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Muat Dokumen Terlampir</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dual Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: PDF Inventaris Barang */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-blue-400 transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                1
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Sumber Utama
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              PDF Daftar Inventaris Barang
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Buku register inventaris aset (format PDF teks atau hasil scan berfoto).
            </p>

            <div
              onClick={() => invInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-5 text-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/30 transition group"
            >
              <input
                ref={invInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleInvChange}
              />
              <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-blue-600 mx-auto mb-2 transition" />
              <div className="text-xs font-semibold text-slate-700 group-hover:text-blue-700">
                Klik untuk unggah PDF baru
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Mendukung multi-halaman &amp; OCR scanner</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 truncate">
              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-medium text-slate-700 truncate">{inventoryFileName}</span>
            </div>
            <span className="text-slate-400 shrink-0 font-medium">
              {totalPages} Halaman
            </span>
          </div>
        </div>

        {/* Card 2: Format / Template KIB */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-amber-400 transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                2
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                Template Resmi
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              File Format / Template KIB
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Format KIB resmi pemerintah (KIB A–F &amp; Belanja Non-Kapitalisasi).
            </p>

            <div
              onClick={() => tplInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-xl p-5 text-center cursor-pointer bg-slate-50/50 hover:bg-amber-50/30 transition group"
            >
              <input
                ref={tplInputRef}
                type="file"
                accept=".xlsx,.xls,.pdf"
                className="hidden"
                onChange={handleTplChange}
              />
              <FileSpreadsheet className="w-8 h-8 text-slate-400 group-hover:text-amber-600 mx-auto mb-2 transition" />
              <div className="text-xs font-semibold text-slate-700 group-hover:text-amber-700">
                Klik untuk unggah Template Excel / PDF
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Mempertahankan 7 sheet resmi &amp; formula</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 truncate">
              <FileSpreadsheet className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-medium text-slate-700 truncate">{templateFileName}</span>
            </div>
            <span className="text-emerald-600 font-semibold flex items-center space-x-1 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>7 Sheet Siap</span>
            </span>
          </div>
        </div>
      </div>

      {/* Information Callout */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-start space-x-3 text-xs text-slate-600">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-slate-800">Prinsip Konsistensi Dokumen:</div>
          Sistem akan menjaga struktur tabel, nama sheet, urutan kolom, rumus subtotal, dan identitas dokumen dari template yang diunggah. Seluruh data dari PDF akan diekstrak tanpa ada baris barang yang terlewatkan (Zero-Loss Extraction).
        </div>
      </div>

      {/* Proceed CTA */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onProceed}
          className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-3 hover:translate-x-0.5"
        >
          <span>Mulai Ekstraksi Dokumen ({totalPages} Halaman)</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
