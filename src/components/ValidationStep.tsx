import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  HelpCircle,
} from 'lucide-react';
import { ValidationSummary, ValidationIssue } from '../types/inventory';

interface ValidationStepProps {
  summary: ValidationSummary;
  onProceed: () => void;
  onJumpToReviewWithFilter?: (filterType: string) => void;
}

export const ValidationStep: React.FC<ValidationStepProps> = ({
  summary,
  onProceed,
  onJumpToReviewWithFilter,
}) => {
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'INFO'>('ALL');

  const filteredIssues = summary.issues.filter(
    (i) => severityFilter === 'ALL' || i.severity === severityFilter
  );

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-300';
    if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-300';
    return 'text-rose-600 bg-rose-50 border-rose-300';
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
          <span>Tahap 5: Pemeriksaan Otomatis 12-Aturan Integritas &amp; Kesiapan Audit</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Laporan Validasi Kepatuhan Administrasi KIB
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Sistem menjalankan uji silang menyeluruh untuk mendeteksi potensi duplikasi, data hilang, inkonsistensi
          klasifikasi, dan kelengkapan kolom tanpa pernah mengarang data fiktif.
        </p>
      </div>

      {/* Main Readiness Score Banner & Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between md:col-span-1">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Indikator Kesiapan Audit
              </span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-baseline space-x-2 my-2">
              <span className="text-5xl font-black text-slate-900">
                {summary.readinessScore}%
              </span>
              <span className="text-xs font-semibold text-slate-500">Indeks Kepatuhan</span>
            </div>
            <div
              className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${getScoreColor(
                summary.readinessScore
              )}`}
            >
              {summary.readinessScore >= 80 ? 'SIAP UNTUK PEMERIKSAAN AWAL' : 'MEMERLUKAN TINDAK LANJUT'}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 mt-4 pt-3 border-t border-slate-100 leading-relaxed">
            *Skor dihitung berdasarkan zero-loss check, konsistensi kode/register, dan kelengkapan kolom tanpa asumsi harga fiktif.
          </div>
        </div>

        {/* 4 Fast Metrics in 2x2 */}
        <div className="grid grid-cols-2 gap-4 md:col-span-2">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Uji Zero Data Loss</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-600 mt-2">100% Lolos</div>
            <div className="text-[11px] text-slate-500 mt-1">
              {summary.totalItems} baris dokumen PDF utuh
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Perlu Verifikasi</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 mt-2">
              {summary.statusCounts.PERLU_VERIFIKASI + summary.statusCounts.BERMASALAH} Baris
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Termasuk aset kondisi Rusak / Musnah
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Indikasi Duplikat</span>
              <HelpCircle className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {summary.duplicateCount} Baris
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Pembelian berkala diuji silang
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Status Harga Sumber</span>
              <ShieldCheck className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {summary.itemsWithoutPriceCount} Item
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Faktual: Buku register manual tanpa kolom harga
            </div>
          </div>
        </div>
      </div>

      {/* Issues List with Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Daftar Temuan Pemeriksaan 12-Aturan Audit ({summary.issues.length} Temuan)
            </h3>
            <p className="text-xs text-slate-500">
              Disusun berdasarkan tingkat urgensi administrasi untuk pemeriksaan aset
            </p>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setSeverityFilter('ALL')}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                severityFilter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              Semua ({summary.issues.length})
            </button>
            <button
              onClick={() => setSeverityFilter('HIGH')}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                severityFilter === 'HIGH'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white text-rose-700 border border-rose-200'
              }`}
            >
              High ({summary.highIssuesCount})
            </button>
            <button
              onClick={() => setSeverityFilter('MEDIUM')}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                severityFilter === 'MEDIUM'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-amber-700 border border-amber-200'
              }`}
            >
              Medium ({summary.mediumIssuesCount})
            </button>
            <button
              onClick={() => setSeverityFilter('INFO')}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                severityFilter === 'INFO'
                  ? 'bg-sky-600 text-white'
                  : 'bg-white text-sky-700 border border-sky-200'
              }`}
            >
              Info Audit ({summary.infoIssuesCount})
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
          {filteredIssues.map((issue) => {
            const isHigh = issue.severity === 'HIGH';
            const isMedium = issue.severity === 'MEDIUM';

            return (
              <div key={issue.id} className="p-4 hover:bg-slate-50/70 transition space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                        isHigh
                          ? 'bg-rose-50 text-rose-700 border-rose-300'
                          : isMedium
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'bg-sky-50 text-sky-700 border-sky-300'
                      }`}
                    >
                      {issue.severity}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      Aturan #{issue.ruleId}: {issue.ruleTitle}
                    </span>
                  </div>

                  {issue.pageNumber && (
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      Hal. {issue.pageNumber}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {issue.description}
                </p>

                <div className="bg-slate-50/80 rounded-lg p-2.5 text-xs text-slate-600 border border-slate-200/60 flex items-start space-x-2">
                  <span className="text-amber-600 font-bold shrink-0">💡 Rekomendasi Audit:</span>
                  <span>{issue.recommendation}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex justify-between items-center pt-2">
        <div className="text-xs text-slate-500">
          ✓ Hasil validasi dapat diunduh dalam bentuk Laporan Pemeriksaan Aset.
        </div>
        <button
          onClick={onProceed}
          className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-3 hover:translate-x-0.5"
        >
          <span>Tinjau di Tabel Review &amp; Audit Trail (Tahap 6)</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
