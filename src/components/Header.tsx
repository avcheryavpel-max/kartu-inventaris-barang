import React from 'react';
import { FileSpreadsheet, ShieldCheck, RefreshCw, School, FileText, CheckCircle2 } from 'lucide-react';
import { InstitutionInfo } from '../utils/excelExporter';

interface HeaderProps {
  institution: InstitutionInfo;
  activeDocumentName: string;
  totalPages: number;
  totalItems: number;
  readinessScore: number;
  onReset: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  institution,
  activeDocumentName,
  totalPages,
  totalItems,
  readinessScore,
  onReset,
  onOpenSettings,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 border border-amber-400/30">
              <FileSpreadsheet className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
                  SMART KIB
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Audit Grade v2.6
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium truncate max-w-md">
                Sistem Cerdas Pengolahan Data Inventaris & Kartu Inventaris Barang
              </p>
            </div>
          </div>

          {/* School & Audit Context Badge */}
          <div className="hidden lg:flex items-center space-x-4 bg-slate-800/80 px-3.5 py-1.5 rounded-lg border border-slate-700/60 text-xs">
            <div className="flex items-center space-x-2 border-r border-slate-700 pr-3">
              <School className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Satuan Pendidikan</div>
                <div className="font-semibold text-slate-200">{institution.schoolName}</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 border-r border-slate-700 pr-3">
              <FileText className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Sumber Dokumen</div>
                <div className="font-medium text-slate-300 flex items-center space-x-1">
                  <span className="truncate max-w-[140px]">{activeDocumentName}</span>
                  <span className="text-slate-500">({totalPages} hal)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Integritas Audit</div>
                <div className="font-semibold text-emerald-300 flex items-center space-x-1">
                  <span>{readinessScore}% Kesiapan</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenSettings}
              className="text-xs font-medium px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center space-x-1.5"
              title="Pengaturan Identitas SKPD / Sekolah"
            >
              <span>Identitas KIB</span>
            </button>
            <button
              onClick={onReset}
              className="text-xs font-medium px-3 py-2 rounded-lg bg-slate-800/90 hover:bg-rose-900/40 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-700/50 transition flex items-center space-x-1.5"
              title="Reset dan muat ulang data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Banner: Strict Audit Principle */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-amber-950/60 px-4 py-1 border-t border-slate-800/80 text-[11px] text-slate-300 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">
              PRINSIP INTEGRITAS DATA AUDIT:
            </span>
            <span className="text-slate-300 truncate">
              FAKTA DOKUMEN &gt; ASUMSI &gt; PERKIRAAN • Dilarang Mengarang Harga / Tahun / Kondisi
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-3 text-[11px] text-slate-400 shrink-0">
            <span>Format Resmi: Permendagri 19/2016 &amp; 108/2016</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-medium">
              {totalItems} Item Terekstraksi (Zero Loss)
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
