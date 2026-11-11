import React from 'react';
import { X, ShieldCheck, History, FileText, CheckCircle2 } from 'lucide-react';
import { InventoryItem } from '../types/inventory';
import { KIB_CATEGORY_META } from '../utils/classifier';

interface AuditTrailModalProps {
  item: InventoryItem | null;
  onClose: () => void;
  onOpenPdfPage?: (pageNumber: number) => void;
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({
  item,
  onClose,
  onOpenPdfPage,
}) => {
  if (!item) return null;
  const meta = KIB_CATEGORY_META[item.category];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Matriks Jejak Audit &amp; Ketertelusuran Sumber</h3>
              <p className="text-xs text-slate-400 font-mono">ID: {item.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Item Basic Summary */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Identitas Aset
              </span>
              <span className={`px-2 py-0.5 rounded font-bold border ${meta.badgeBg}`}>
                {meta.label}
              </span>
            </div>
            <div className="text-base font-extrabold text-slate-900">{item.standardName}</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-200">
              <div>
                <span className="text-slate-400 block">Nomor Register:</span>
                <span className="font-mono font-bold text-slate-800">'{item.registerNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Kuantitas:</span>
                <span className="font-bold text-slate-800">{item.quantity} {item.unit}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Tanggal:</span>
                <span className="font-bold text-slate-800">{item.purchaseDateRaw}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Sumber Dana:</span>
                <span className="font-bold text-slate-800">{item.fundingSource}</span>
              </div>
            </div>
          </div>

          {/* Source Provenance */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Jejak Dokumen Sumber Asli</span>
            </h4>
            <div className="bg-blue-50/50 rounded-xl p-3.5 border border-blue-200 text-blue-950 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold">File: </span>
                  <span className="font-mono">{item.sourceDocument}</span>
                </div>
                {onOpenPdfPage && (
                  <button
                    onClick={() => {
                      onOpenPdfPage(item.pageNumber);
                      onClose();
                    }}
                    className="text-[11px] font-bold text-blue-700 hover:underline bg-white px-2 py-0.5 rounded border border-blue-300"
                  >
                    Buka Hal. {item.pageNumber}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500">Halaman PDF:</span>{' '}
                  <span className="font-bold">Halaman {item.pageNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500">Nomor Baris di Buku:</span>{' '}
                  <span className="font-bold">No. {item.rawItemNo}</span>
                </div>
                <div>
                  <span className="text-slate-500">Teks Asli di Buku:</span>{' '}
                  <span className="font-medium italic">"{item.rawName}"</span>
                </div>
                <div>
                  <span className="text-slate-500">Bukti Visual:</span>{' '}
                  <span className="font-medium text-emerald-700">Foto Terlampir di Halaman {item.pageNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Classification Rationale */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Dasar Hukum &amp; Pertimbangan Klasifikasi</span>
            </h4>
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 leading-relaxed text-slate-700">
              {item.classificationReason}
            </div>
          </div>

          {/* Audit Log Timeline */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
              <History className="w-4 h-4 text-slate-600" />
              <span>Riwayat Perubahan &amp; Tindakan (Audit Log)</span>
            </h4>
            <div className="space-y-2">
              {item.auditTrail.map((log, idx) => (
                <div
                  key={log.id || idx}
                  className="bg-white rounded-lg p-3 border border-slate-200 space-y-1 shadow-2xs"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-800">
                      Tindakan: {log.action}
                    </span>
                    <span className="text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <p className="text-slate-600">{log.reason}</p>
                  <div className="text-[10px] text-slate-400">
                    Pelaksana: <span className="font-semibold">{log.actor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
